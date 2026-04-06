async function addSkill(e) {
  e.preventDefault();
  const skillName = document.getElementById("skill-name").value;
  if (!skillName) return;

  const res = await fetch("http://localhost:5000/add-skill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser.email, skill: skillName })
  });

  const data = await res.json();
  if (data.success) {
    currentUser.skills = data.skills || [];
    renderSkills();
    document.getElementById("skill-name").value = "";
    showToast("Skill added", "success");
  }
}

function renderSkills() {
  const container = document.getElementById("skills-container");
  container.innerHTML = "";
  (currentUser.skills || []).forEach(skill => {
    const div = document.createElement("div");
    div.innerHTML = `<p>${skill}</p>`;
    container.appendChild(div);
  });
}