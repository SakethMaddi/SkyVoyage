// login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const errorEl = document.getElementById("loginError");
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    errorEl.textContent = "";
    const storedUser =
      JSON.parse(localStorage.getItem("registeredUser"));
    if (!storedUser) {
      errorEl.textContent = "No account found. Please sign up.";
      return;
    }
    const emailMatch =
      storedUser.email.toLowerCase() === email.toLowerCase();
    const passwordMatch = storedUser.password === password;
    if (emailMatch && passwordMatch) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify(storedUser)
      );
      window.location.href = "index.html";
    } else {
      errorEl.textContent = "Invalid email or password.";
    }
  });
});