const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch('https://quickcart-6644.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login successful!');
      console.log(data);

      // **Save token here**
      localStorage.setItem('token', data.token);

      window.location.href = 'cart.html';
    } else {
      alert(data.message || 'Login failed!');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Something went wrong. Please try again.');
  }
});
