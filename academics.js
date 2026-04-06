async function updateCGPA() {
  if (!currentUser) return;
  const cgpa = Number(document.getElementById("cgpa-input").value);
  if (!cgpa) return showToast("Enter valid CGPA", "error");

  const res = await fetch("http://localhost:5000/update-cgpa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser.email, cgpa })
  });
  const data = await res.json();
  if (data.success) {
    currentUser.cgpa = data.cgpa;
    showToast("CGPA updated", "success");
  }
}

async function markAttendance(isPresent) {
  if (!currentUser) return;
  const subject = document.getElementById("subject-name").value;
  if (!subject) return showToast("Enter subject name", "error");

  const teacher = prompt("Enter teacher name:") || "";
  const res = await fetch("http://localhost:5000/update-attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser.email, subject, present: isPresent, teacher })
  });

  const data = await res.json();
  if (data.success) {
    currentUser.attendance = data.attendance;
    renderAcademics();
    showToast("Attendance updated", "success");
  }
}

function renderAcademics() {
  if (!currentUser) return;

  document.getElementById("cgpa-value").textContent = currentUser.cgpa || 0;

  const container = document.getElementById("attendance-container");
  container.innerHTML = "";

  (currentUser.attendance || []).forEach(sub => {
    const percent = sub.total === 0 ? 0 : Math.round((sub.present / sub.total) * 100);
    const div = document.createElement("div");
    div.textContent = `${sub.subject} (Teacher: ${sub.teacher || ''}): ${percent}% (${sub.present}/${sub.total})`;
    container.appendChild(div);
  });
}