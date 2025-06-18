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
      const response = await fetch('https://your-backend-url.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        console.log(data);
        // Optionally redirect
        // window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Something went wrong. Please try again.');
    }
  });
