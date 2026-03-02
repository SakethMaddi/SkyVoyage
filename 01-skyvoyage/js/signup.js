document.getElementById("signupForm")
  .addEventListener("submit", function (e) {

  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

  const error = document.getElementById("signupError");
  error.textContent = "";

  if (password !== confirmPassword) {
    error.textContent = "Passwords do not match.";
    return;
  }

  if (password.length < 6) {
    error.textContent = "Password must be at least 6 characters.";
    return;
  }

  const existingUser = JSON.parse(localStorage.getItem("registeredUser"));

  if (existingUser && existingUser.email === email) {
    error.textContent = "Account already exists with this email.";
    return;
  }

  const newUser = {
    name,
    email,
    password
  };

  localStorage.setItem(
    "registeredUser",
    JSON.stringify(newUser)
  );

  alert("Account created successfully! Please login.");

  window.location.href = "login.html";
});