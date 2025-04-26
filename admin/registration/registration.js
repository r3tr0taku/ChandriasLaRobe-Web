// Password visibility toggle
function setupPasswordToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  if (input && toggle) {
    toggle.addEventListener('click', function () {
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      this.classList.toggle('bx-show');
      this.classList.toggle('bx-hide');
    });
  }
}

setupPasswordToggle('login-password', 'toggle-login-password');
setupPasswordToggle('register-password', 'toggle-register-password');
setupPasswordToggle('register-confirm-password', 'toggle-register-confirm-password');