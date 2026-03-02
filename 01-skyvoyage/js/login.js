
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault(); 
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const error = document.getElementById("loginError");
    error.textContent = "";
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (!storedUser) {
    error.textContent = "No account found. Please sign up.";
    return;
    }
    if (email === storedUser.email && password === storedUser.password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem( "currentUser", JSON.stringify(storedUser) );
        alert("Login successful! Redirecting to search page...");
        window.location.href = "index.html";
    } else {
    error.textContent = "Invalid email or password.";
    }
});

document.getElementById("logoutBtn")
  ?.addEventListener("click", () => {

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");

  window.location.href = "login.html";
});