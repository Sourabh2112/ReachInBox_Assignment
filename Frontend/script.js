let allEmails = [];

async function loadEmails() {
    const emailInput = document.getElementById('emailInput').value.trim();
    if (!emailInput) {
        alert("Please enter an email address.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/api/emails/${emailInput}`);
        allEmails = await response.json();
        displayEmails(allEmails);
    } catch (error) {
        console.error("Error loading emails:", error);
        alert("Failed to load emails.");
    }
}

function displayEmails(emails) {
    const tbody = document.getElementById('emailTableBody');
    tbody.innerHTML = '';

    emails.forEach(email => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${new Date(email.date).toLocaleString()}</td>
      <td>${email.label}</td>
      <td>${email.from}</td>
      <td>${email.subject}</td>
    `;
        tbody.appendChild(row);
    });
}

function searchEmails() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredEmails = allEmails.filter(email => {
        return (
            email.from.toLowerCase().includes(searchTerm) ||
            email.subject.toLowerCase().includes(searchTerm) ||
            (email.labels && email.labels.join(' ').toLowerCase().includes(searchTerm))
        );
    });

    displayEmails(filteredEmails);
}
