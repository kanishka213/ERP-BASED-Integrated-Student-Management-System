function updateProfileUI() {
  if (!currentUser) return;

  document.getElementById('profile-name').textContent = currentUser.name || "";
  document.getElementById('profile-email').textContent = currentUser.email || "";
  document.getElementById('profile-roll').textContent = currentUser.roll || "";
  document.getElementById('profile-dept').textContent = currentUser.department || "";
  document.getElementById('profile-sem').textContent = currentUser.semester || "";
}

function showDashboard() {
  document.getElementById('view-login').classList.add('hidden');
  document.getElementById('view-dashboard').classList.remove('hidden');

  updateProfileUI();
  document.getElementById('dashboard-user').textContent = currentUser.name;

  if (currentUser.role === "admin") {
    document.getElementById('admin-students').classList.remove('hidden');
    loadAllStudents();
  } else {
    renderStudentInfo();
  }
}

function switchPage(page) {
  ['dashboard','profile','skills','documents','academics']
    .forEach(p => {
      const el = document.getElementById('page-' + p);
      if(el) el.classList.toggle('hidden', p !== page);
    });
}

// ----------------- STUDENT VIEW -----------------
function renderStudentInfo() {
  if (!currentUser) return;

  // Fees
  document.getElementById('fee-total').textContent = currentUser.fees?.total || 0;
  document.getElementById('fee-paid').textContent = currentUser.fees?.paid || 0;
  document.getElementById('fee-pending').textContent = currentUser.fees?.pending || 0;

  // Notices
  const noticesEl = document.getElementById('notices-list');
  noticesEl.innerHTML = '';
  (currentUser.notices || []).forEach(n => {
    const li = document.createElement('li');
    li.textContent = `${n.date || ''} - ${n.title || ''}: ${n.message || ''}`;
    noticesEl.appendChild(li);
  });

  // Exam results
  const resultsEl = document.getElementById('results-list');
  resultsEl.innerHTML = '';
  (currentUser.examResults || []).forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.subject}: ${r.marks} (${r.grade})`;
    resultsEl.appendChild(li);
  });
}

// ----------------- ADMIN VIEW -----------------
async function loadAllStudents() {
  try {
    const res = await fetch("http://localhost:5000/students");
    const data = await res.json();
    if (!data.success) return;

    const tbody = document.getElementById('students-table');
    tbody.innerHTML = '';

    data.students.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.roll || ''}</td>
        <td>${s.department || ''}</td>
        <td>${s.semester || ''}</td>
        <td>
          <button onclick="viewStudent('${s.email}')" class="bg-indigo-500 text-white px-2 rounded">View</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

async function viewStudent(email) {
  try {
    const res = await fetch("http://localhost:5000/students");
    const data = await res.json();
    if (!data.success) return;

    const student = data.students.find(s => s.email === email);
    if (!student) return;

    currentUser = student;
    showDashboard();
    showToast("Viewing student: " + student.name, "info");
  } catch (err) {
    console.error(err);
  }
}