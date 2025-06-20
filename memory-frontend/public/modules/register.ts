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

  const usernameInput = form.elements.namedItem('username') as HTMLInputElement;
  const emailInput = form.elements.namedItem('email') as HTMLInputElement;
  const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
  const confirmPasswordInput = form.elements.namedItem('password_rep') as HTMLInputElement;
  if (!usernameInput?.value || !passwordInput?.value || !emailInput?.value || !confirmPasswordInput?.value) {
    setInputBorder(true, 'Please fill in all fields');
    return;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    setInputBorder(true, 'Passwords do not match');
    return;
  }

  const api = new API();
  try {
    let error = await api.publicRegisterPlayer(usernameInput.value, emailInput.value, passwordInput.value);
    if (error === true) {
      setInputBorder(true, 'Something went wrong while registering');
      return;
    } 
    setInputBorder(false);
    document.location.href = '/login'; // Redirect to the home page after successful login
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