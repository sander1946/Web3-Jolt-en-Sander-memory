import { API } from "./api.js";

const formElement = document.getElementById('form') as HTMLFormElement | null;
if (formElement) {
  formElement.addEventListener('submit', event => event.preventDefault());
}

const loginForm = document.getElementById('form') as HTMLFormElement | null;
if (!loginForm) {
  console.error('Login form not found');
  throw new Error('Login form not found');
}

loginForm.addEventListener('submit', async function() {
  let form = loginForm;
  if (!form) {
    console.error('Form element not found');
    return;
  }
  setInputBorder(false); // Reset input borders

  let usernameInput = form.elements.namedItem('username') as HTMLInputElement;
  let passwordInput = form.elements.namedItem('password') as HTMLInputElement;
  if (!usernameInput?.value || !passwordInput?.value) {
    setInputBorder(true, 'Please fill in both username and password');
    return;
  }

  let api = new API();
  try {
    let tokenResult = await api.publicLoginPlayer(usernameInput.value, passwordInput.value);

    if (typeof tokenResult === "boolean") {
      if (tokenResult !== true) {
        setInputBorder(true, 'Invalid username or password');
        return;
      } 
      setInputBorder(false, 'There was a problem while logging in');
      return;
    }
    setInputBorder(false);
    console.log('Login successful:', tokenResult);
    localStorage.clear(); // Clear any existing local storage such as preferences
    localStorage.setItem('token', tokenResult);
    document.location.href = '/'; // Redirect to the home page after successful login
  } catch (error) {
    setInputBorder(true, 'There was a problem with the fetch operation');
    console.error('There was a problem with the fetch operation:', error);
  }
});

function setInputBorder(enabled = true, message = '') {
  let inputs = document.querySelectorAll('input');
  let errorElement = document.getElementById('error');
  if (!inputs || inputs.length === 0) {
    console.error('No input elements found');
    return;
  }

  if (!errorElement) {
    console.error('Error element not found');
    return;
  }

  if (enabled) {
    inputs.forEach(input => {
      input.style.border = '2px solid #F00';
    });
    errorElement.innerHTML = message;
    errorElement.style.display = 'flex';
    return;
  }

  inputs.forEach(input => {
    input.style.border = 'none';
  });
  if (message !== '') {
    errorElement.innerHTML = message;
    errorElement.style.display = 'flex';
  }
  else {
    errorElement.innerHTML = '';
    errorElement.style.display = 'none';
  }
}