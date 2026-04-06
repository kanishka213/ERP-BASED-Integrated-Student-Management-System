window.onload = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      currentUser = user;
      showDashboard();
      renderAcademics();
      renderSkills();
      renderDocuments();
    }

    if (typeof lucide !== "undefined") lucide.createIcons();
  } catch (err) {
    console.log(err);
  }
};