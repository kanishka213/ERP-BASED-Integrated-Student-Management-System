// ================= TOAST MESSAGE =================
function showToast(msg, type = "info") {
  const t = document.getElementById('toast');
  if (!t) return;

  t.textContent = msg;
  t.className = 'toast-msg';
  t.classList.remove('hidden');
  t.style.background =
    type === 'error' ? '#ef4444' :
    type === 'success' ? '#10b981' : '#6366f1';
  t.style.color = '#fff';

  setTimeout(() => {
    t.classList.add('hidden');
  }, 3000);
}