let currentUser = null;

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-pass').value;

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      localStorage.setItem("user", JSON.stringify(data.user));
      showDashboard();
      showToast("Login successful!", "success");
    } else {
      showToast("Invalid email or password", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Server error", "error");
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem("user");
  document.getElementById('view-dashboard').classList.add('hidden');
  document.getElementById('view-login').classList.remove('hidden');
}