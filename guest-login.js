document.getElementById('guestLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = {
    email: formData.get('email'),
    password: formData.get('password')
  };
  fetch('http://localhost:3000/api/guest/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async res => {
      const text = await res.text();
      if (res.ok && text.includes('success')) {
        alert('Login successful!');
        window.location.href = 'flash.html'; // Redirect to main dashboard
      } else {
        alert('Login failed: ' + text);
      }
    })
    .catch(err => {
      alert('Login failed: ' + err);
    });
});
