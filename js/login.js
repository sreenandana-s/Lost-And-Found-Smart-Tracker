import { system } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const success = system.login(email, password);

    if (success) {
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
});
