async function addDocument(e) {
  e.preventDefault();
  const name = document.getElementById('doc-name').value;
  const type = document.getElementById('doc-type').value || 'Document';
  if (!name) return;

  const documentObj = { name, type };

  const res = await fetch("http://localhost:5000/add-document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser.email, document: documentObj })
  });

  const data = await res.json();
  if (data.success) {
    currentUser.documents = data.documents || [];
    renderDocuments();
    document.getElementById('doc-name').value = "";
    document.getElementById('doc-type').value = "";
    showToast("Document added", "success");
  }
}

function renderDocuments() {
  const container = document.getElementById('documents-container');
  container.innerHTML = '';
  (currentUser.documents || []).forEach(doc => {
    const div = document.createElement('div');
    div.textContent = `${doc.name} (${doc.type})`;
    container.appendChild(div);
  });
}