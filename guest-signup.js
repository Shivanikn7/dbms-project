document.getElementById('guestSignupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    phone_number: formData.get('phone_number'),
    address: formData.get('address'),
    password: formData.get('password')
  };
  fetch('http://localhost:3000/api/guest/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async res => {
      const text = await res.text();
      if (res.ok && text.includes('success')) {
        alert('Signup successful! You can now login.');
        window.location.href = 'guest-login.html';
        return;
      }
      
    })
    .catch(err => {
      alert('Signup failed: ' + err);
    });
});
