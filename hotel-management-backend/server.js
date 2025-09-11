// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shivani1824', // update with your MySQL root password
  database: 'hotel__management_001' // change this if your DB name is different
});

// Ensure guest_users table exists
db.query(`CREATE TABLE IF NOT EXISTS guest_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  address VARCHAR(255),
  password VARCHAR(100) NOT NULL
)`, (err) => {
  if (err) console.error('Error creating guest_users table:', err);
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// ROUTE: Handle booking from user/staff frontend
// ROUTE: Guest Signup
app.post('/api/guest/signup', (req, res) => {
  const { full_name, email, phone_number, address, password } = req.body;
  if (!full_name || !email || !phone_number || !address || !password) {
    return res.status(400).send('All fields are required.');
  }
  // Try to insert, if duplicate email, show friendly error
  const query = `INSERT INTO guest_users (full_name, email, phone_number, address, password) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [full_name, email, phone_number, address, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Email already registered. Please login.');
      }
      return res.status(500).send('Signup failed: Database error.');
    }
    res.status(200).send('success: Signup complete.');
  });
});

// ROUTE: Guest Login
app.post('/api/guest/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password required.');
  }
  const query = `SELECT * FROM guest_users WHERE email = ? AND password = ? LIMIT 1`;
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).send('Login failed: ' + err.sqlMessage);
    if (results.length === 0) {
      return res.status(401).send('Invalid credentials.');
    }
    res.status(200).send('success: Login successful.');
  });
});
app.post('/api/book', (req, res) => {
  const {
    full_name, email, phone_number, address,
    check_in_date, check_out_date,
    last_visit,
    total_visits, total_amount,
    isOffline,
    room_type, // add room_type for debugging
    room_id // add room_id for debugging
  } = req.body;

  // Debug: log all incoming booking data
  console.log('Received booking payload:', req.body);

  // 1. Insert into guests table
  const guestQuery = `
    INSERT INTO guests (full_name, email, phone_number, address, total_visits, last_visit)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const guestData = [full_name, email, phone_number, address, total_visits, last_visit];
  console.log('Inserting guest data:', guestData);

  db.query(guestQuery, guestData, (err, guestResult) => {
    if (err) {
      console.error('Error inserting into guests table:', err);
      return res.status(500).send('Failed to insert guest. MySQL error: ' + err.sqlMessage);
    }

    const guestId = guestResult.insertId;

    // 2. Insert into bookings table
    if (!room_id) {
      console.error('Missing room_id in booking payload:', req.body);
      return res.status(400).json({ error: "room_id is required in the request body." });
    }

    const bookingQuery = `
      INSERT INTO bookings (guest_id, room_id, check_in_date, check_out_date, total_amount, booking_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const bookingData = [
      guestId, room_id, check_in_date, check_out_date, total_amount,
      'pending'
    ];
    console.log('Inserting booking data:', bookingData);

    db.query(bookingQuery, bookingData, (err, bookingResult) => {
      if (err) {
        console.error('Error inserting into bookings table:', err);
        return res.status(500).send('Failed to insert booking. MySQL error: ' + err.sqlMessage);
      }
      res.status(200).send('Booking and guest data saved successfully.');
    });
  });
});

// ROUTE: Get total visits by phone number
// ROUTE: Get all guest signup users (for admin/staff)
app.get('/api/guest/users', (req, res) => {
  db.query('SELECT id, full_name, email, phone_number, address FROM guest_users ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('Error fetching guest users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
app.get('/api/guest/total-visits', (req, res) => {
  const phone = req.query.phone;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number required' });
  }

  const query = 'SELECT full_name, total_visits FROM guests WHERE phone_number = ? ORDER BY guest_id DESC LIMIT 1';
  db.query(query, [phone], (err, results) => {
    if (err) {
      console.error('Error fetching total visits:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      res.json({
        name: results[0].full_name,
         totalVisits: results[0].total_visits 
      });
     
    } else {
      res.json({ name: null, totalVisits: 0 });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

