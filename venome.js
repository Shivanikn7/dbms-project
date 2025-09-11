// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const staffDashboard = document.getElementById('staffDashboard');
const userDashboard = document.getElementById('userDashboard');
const mainContent = document.getElementById('mainContent');

// Room data
const rooms = [
  {
    id: 1,
    name: 'Deluxe Ocean View',
    type: 'deluxe',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800',
    description: 'Luxurious room with panoramic ocean views and private balcony',
    capacity: 2,
    status: 'available'
  },
  {
    id: 2,
    name: 'Executive Suite',
    type: 'executive',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800',
    description: 'Spacious suite with separate living area and premium amenities',
    capacity: 2,
    status: 'available'
  },
  {
    id: 3,
    name: 'Garden Villa',
    type: 'garden',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800',
    description: 'Private villa surrounded by tropical gardens with personal pool and exclusive amenities.',
    capacity: 4,
    status: 'available'
  },
  {
    id: 4,
    name: 'Penthouse Suite',
    type: 'penthouse',
    price: 12000,
    image: '',
    description: 'Top floor suite with panoramic views and luxury amenities.',
    capacity: 4,
    status: 'available'
  }
];

// Booking data (simulated database)
let bookings = [];

// Login functionality
function showLoginModal() {
  loginModal.style.display = 'block';
}

function showLoginForm(type) {
  const buttons = document.querySelectorAll('.login-options button');
  buttons.forEach(button => button.classList.remove('active'));
  event.target.classList.add('active');
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  // Determine which login is active
  const staffBtn = document.querySelector('.login-options button.active');
  const isStaffLogin = staffBtn && staffBtn.textContent.trim().toLowerCase().includes('staff');

  if (isStaffLogin) {
    // Simulate staff authentication
    if (email === 'staff@hotel.com' && password === 'staff123') {
      loginModal.style.display = 'none';
      showStaffDashboard(); // Show staff dashboard (staff form)
    } else {
      alert('Invalid staff credentials');
    }
  } else {
    // Simulate guest authentication
    if (email === 'user@example.com' && password === 'user123') {
      loginModal.style.display = 'none';
      showUserDashboard(); // Show guest dashboard (guest form)
      // Optionally scroll to guest booking form
      const guestForm = document.getElementById('userbookingForm');
      if (guestForm) guestForm.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Invalid guest credentials');
    }
  }
});

function showStaffDashboard() {
  staffDashboard.classList.remove('hidden');
  userDashboard.classList.add('hidden');
  mainContent.classList.add('hidden');
  updateDashboard();
}

function showUserDashboard() {
  userDashboard.classList.remove('hidden');
  staffDashboard.classList.add('hidden');
  mainContent.classList.add('hidden');
  updateUserBookings();
}

// Dashboard updates
function updateDashboard() {
  updateNewBookings();
  updateCheckIns();
  updateCheckOuts();
  updateRoomStatus();
}

function updateNewBookings() {
  const newBookings = document.getElementById('newBookings');
  newBookings.innerHTML = bookings
    .filter(booking => booking.status === 'pending')
    .map(booking => createBookingElement(booking))
    .join('');
}

function updateCheckIns() {
  const checkIns = document.getElementById('staffcheckIns');
  const today = new Date().toISOString().split('T')[0];
  checkIns.innerHTML = bookings
    .filter(booking => booking.checkIn === today)
    .map(booking => createBookingElement(booking))
    .join('');
}

function updateCheckOuts() {
  const checkOuts = document.getElementById('staffcheckOuts');
  const today = new Date().toISOString().split('T')[0];
  checkOuts.innerHTML = bookings
    .filter(booking => booking.checkOut === today)
    .map(booking => createBookingElement(booking))
    .join('');
}

function updateRoomStatus() {
  const roomStatus = document.getElementById('roomStatus');
  roomStatus.innerHTML = rooms
    .map(room => `
      <div class="room-status-item ${room.status}">
        <div class="room-number">Room ${room.id}</div>
        <div class="status">${room.status}</div>
      </div>
    `)
    .join('');
}

function createBookingElement(booking) {
  return `
    <div class="booking-item">
      <div class="guest-name">${booking.name}</div>
      <div class="booking-dates">
        ${booking.checkIn} - ${booking.checkOut}
      </div>
      <div class="room-type">${booking.roomType}</div>
      <div class="status">${booking.status}</div>
    </div>
  `;
}

// Booking form handling
const bookingForm = document.getElementById('userbookingForm');
const offlineBookingForm = document.getElementById('staffbookingForm');
if( bookingForm)
{  bookingForm.addEventListener('submit',guesthandleBooking);
}
if( offlineBookingForm)
{
offlineBookingForm.addEventListener('submit', handleBooking);
}

function handleBooking(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const selectedRoomType = formData.get('roomType');
  // Fix: Use correct roomType selector for staff form
  const selectedRoom = rooms.find(room => room.type === selectedRoomType);
  if (!selectedRoomType || !selectedRoom) {
    alert('Please select a valid room type.');
    return;
  }
  let totalAmount = formData.get('totalAmount');
  if (!totalAmount || isNaN(totalAmount)) {
    alert('Total amount is missing or invalid. Please select room type and guests.');
    return;
  }
  totalAmount = parseFloat(totalAmount);
  const payload = {
    full_name: formData.get('name'),
    email: formData.get('email'),
    phone_number: formData.get('phone'),
    address: formData.get('address'),
    check_in_date: formData.get('staffcheckIn'),
    check_out_date: formData.get('staffcheckOut'),
    last_visit: formData.get('last_visit'),
    room_type: selectedRoomType,
    total_visits: formData.get('total_visit'),
    total_amount: totalAmount,
    room_id: selectedRoom.id
  };
  console.log('Staff booking payload:', payload);
  fetch('http://localhost:3000/api/book', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async res => {
      const text = await res.text();
      if (res.ok && text.includes('successfully')) {
        selectedRoom.status = 'occupied';
        alert('Booking successful!');
        e.target.reset();
      } else {
        alert('Booking failed: ' + text);
      }
    })
    .catch(err => {
      alert('Booking failed: ' + err);
      console.error('Booking failed:', err);
    });
}

function guesthandleBooking(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const selectedRoomType = formData.get('roomType');
  // Always pick the first room of the selected type
  const selectedRoom = rooms.find(room => room.type === selectedRoomType);
  if (!selectedRoom) {
    alert('successfully booked');
    return;
  }
  let totalAmount = formData.get('totalAmount');
  if (!totalAmount || isNaN(totalAmount)) {
    alert('Total amount is missing or invalid. Please select room type and guests.');
    return;
  }
  totalAmount = parseFloat(totalAmount);
  const payload = {
    full_name: formData.get('name'),
    email: formData.get('email'),
    phone_number: formData.get('phone'),
    address: formData.get('address'),
    check_in_date: formData.get('usercheckIn'),
    check_out_date: formData.get('usercheckOut'),
    last_visit: formData.get('last_visit'), // <-- use last_visit field from form
    room_type: selectedRoomType,
    total_visits: formData.get('total_visit'),
    total_amount: totalAmount,
    room_id: selectedRoom.id
  };
  // Debug: log payload before sending
  console.log('Guest booking payload:', payload);
  fetch('http://localhost:3000/api/book', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async res => {
      const text = await res.text();
      if (res.ok && text.includes('successfully')) {
        // Mark the room as occupied in the local array
        selectedRoom.status = 'occupied';
        alert('Booking successful!');
        e.target.reset();
      } else {
        alert('Booking failed: ' + text);
      }
    })
    .catch(err => {
      alert('Booking failed: ' + err);
      console.error('Booking failed:', err);
    });
}


function searchGuestByPhone() {
  const phone = document.getElementById('searchGuestPhone').value.trim();
  const resultSpan = document.getElementById('guestVisitResult');
  if (!phone) {
    resultSpan.textContent = "Please enter a phone number.";
    return;
  }
  resultSpan.textContent = "Searching...";

  fetch(`http://localhost:3000/api/guest/total-visits?phone=${encodeURIComponent(phone)}`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      if (data && data.name) {
        resultSpan.textContent = `Name: ${data.name} | Total Visits: ${data.totalVisits}`;
      } else {
        resultSpan.textContent = "Guest not found.";
      }
    })
    .catch(() => {
      resultSpan.textContent = "Error fetching guest info.";
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      // Change icon
      if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
      } else {
        themeToggle.innerHTML = '<i data-lucide="moon"></i>';
      }
      if (window.lucide) lucide.createIcons();
    });
  }
});
