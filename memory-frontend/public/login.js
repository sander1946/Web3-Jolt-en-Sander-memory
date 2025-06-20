document.getElementById('form').addEventListener('submit', event => event.preventDefault());

const loginForm = document.getElementById('form');
loginForm.addEventListener('submit', function() {
  let form = loginForm;
  if (!form.username.value || !form.password.value) {
    setInputBorder(true, 'Please fill in both username and password');
    return;
  }
  let json = JSON.stringify({
    username: form.username.value,
    password: form.password.value
  });

  fetch('http://localhost:8000/memory/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: json
  }).then(response => {
    switch (response.status) {
      case 200:
        return response.json();
      case 400:
        throw new Error('Bad Request: The server could not understand the request due to invalid syntax.');
      case 401:
        setInputBorder(true, 'Invalid username or password');	
        throw new Error('Unauthorized: Access is denied due to invalid credentials.');
      default:
        throw new Error('Network response was not ok ' + response.statusText);
    }
  }).then(data => {
    setInputBorder(false);
    console.log('Login successful:', data);
    localStorage.setItem('token', data.token);
    document.location.href = '/'; // Redirect to the home page after successful login
  }).catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
});

function setInputBorder(enabled = true, message = '') {
  let inputs = document.querySelectorAll('input');
  if (enabled) {
    inputs.forEach(input => {
      input.style.border = '2px solid #F00';
    });
    document.getElementById('error').innerHTML = message;
    document.getElementById('error').style.display = 'flex';
    return;
  }
  inputs.forEach(input => {
    input.style.border = 'none';
  });
  document.getElementById('error').innerHTML = '';
  document.getElementById('error').style.display = 'none';
}