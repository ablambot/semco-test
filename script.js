// --- DATABASE LOGIC (LOCALSTORAGE) ---
const STORAGE_KEY = 'semco_members';

// Initial data if storage is empty
const initialMembers = [
  { id: 10000001, name: 'Juan Dela Cruz', status: 'Active', salary: 35000, contact: '09123456789' },
  { id: 10000002, name: 'Maria Clara', status: 'Pending', salary: 50000, contact: '09171112222' }
];

function getMembers() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialMembers;
}

function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  updateDashboard();
}

// --- UI RENDERING ---

function renderMembers() {
  const members = getMembers();
  const tableBody = document.querySelector("#members tbody");
  if (!tableBody) return;

  tableBody.innerHTML = '';
  members.forEach(member => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td><span class="badge ${member.status.toLowerCase()}">${member.status}</span></td>
      <td>₱${member.salary}</td>
      <td>${member.contact}</td>
      <td>
        <button class="btn btn-primary" onclick="viewMember('${member.name}')">View</button>
        <button class="btn btn-warning" onclick="editMember('${member.name}')">Edit</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updateDashboard() {
  const members = getMembers();
  const totalMembersStat = document.querySelector("#dashboard .card .stat-value");
  if (totalMembersStat) {
    totalMembersStat.innerText = members.length;
  }
}

// --- NAVIGATION LOGIC ---

function setupNavigation() {
  document.querySelectorAll(".sidebar li").forEach(item => {
    item.addEventListener("click", function() {
      document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
      this.classList.add("active");

      document.querySelectorAll(".content-section").forEach(sec => sec.classList.add("d-none"));
      let target = this.dataset.target;
      const section = document.getElementById(target);
      if (section) {
        section.classList.remove("d-none");
      }
      document.getElementById("page-title").innerText = this.innerText;
    });
  });
}

// --- MODAL LOGIC ---

function setupModal() {
  const addMemberBtn = document.getElementById("add-member-btn");
  const addMemberModal = document.getElementById("add-member-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const addMemberForm = document.getElementById("add-member-form");

  if (!addMemberModal) return;

  // Open modal
  if (addMemberBtn) {
    addMemberBtn.onclick = () => {
      addMemberModal.classList.remove("d-none");
    };
  }

  // Close modal with button
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      addMemberModal.classList.add("d-none");
    };
  }

  // Close modal when clicking outside (on the overlay)
  window.addEventListener('click', (e) => {
    if (e.target === addMemberModal) {
      addMemberModal.classList.add("d-none");
    }
  });

  // Close with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && !addMemberModal.classList.contains("d-none")) {
      addMemberModal.classList.add("d-none");
    }
  });

  // --- FORM SUBMISSION ---
  if (addMemberForm) {
    addMemberForm.onsubmit = (e) => {
      e.preventDefault();

      const name = document.getElementById("member-name").value;
      const salary = document.getElementById("member-salary").value;
      const contact = document.getElementById("member-contact").value;
      const status = document.getElementById("member-status").value;

      const members = getMembers();
      const newId = 10000000 + members.length + 1;

      const newMember = {
        id: newId,
        name: name,
        status: status,
        salary: parseInt(salary),
        contact: contact
      };

      members.push(newMember);
      saveMembers(members);
      renderMembers();

      alert(`Member ${name} has been added successfully!`);

      addMemberForm.reset();
      addMemberModal.classList.add("d-none");
    };
  }
}

// --- INTERACTIVE BUTTONS ---

window.viewMember = function(name) {
  alert(`Viewing details for: ${name}`);
};

window.editMember = function(name) {
  alert(`Editing details for: ${name}`);
};

// --- REPORT LOGIC ---

function setupReports() {
  const downloadBtn = document.querySelector("#reports .btn-primary");
  if (downloadBtn) {
    downloadBtn.onclick = function() {
      this.innerText = "Generating...";
      this.disabled = true;
      setTimeout(() => {
        alert("Report has been generated and downloaded!");
        this.innerText = "Download PDF";
        this.disabled = false;
      }, 1500);
    };
  }
}

// --- INITIALIZE ---

document.addEventListener('DOMContentLoaded', () => {
  renderMembers();
  updateDashboard();
  setupNavigation();
  setupModal();
  setupReports();
});