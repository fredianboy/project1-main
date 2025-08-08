const BASE_URL = 'https://stock-backend-rv75.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('loggedInUser');
  if (!currentUser) return console.warn("⚠️ No user found in localStorage");

  const url = `${BASE_URL}/api/orders/summary?user=${encodeURIComponent(currentUser)}`;

  fetch(url)
    .then(res => res.json())
    .then(summary => {
      const tableBody = document.querySelector('#orders-table tbody');
      if (!tableBody) return console.warn("⚠️ Table body not found");

      tableBody.innerHTML = '';

      summary.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order._id}</td>
          <td>${order.medsName}</td>
          <td>${order.totalAmount}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error('❌ Failed to load summary:', err);
    });

  // ✅ Load and show preview data
  const previewData = JSON.parse(localStorage.getItem("reorderData")) || [];
  populateTable(previewData);
});

function populateTable(data) {
  const tableBody = document.querySelector("#summary-table tbody");
  const orderedByInput = document.getElementById('myInput');
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (orderedByInput && loggedInUser) {
    orderedByInput.value = loggedInUser;
    orderedByInput.readOnly = true;
  }

  if (!tableBody) return;

  if (data.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3">No reorder data available.</td>`;
    tableBody.appendChild(row);
  } else {
    const grouped = {};

    data.forEach(item => {
      const key = item.mnemonic;
      const amount = parseInt(item.amount);

      if (!grouped[key]) {
        grouped[key] = {
          mnemonic: item.mnemonic,
          medsName: item.medsName,
          amount: amount
        };
      } else {
        grouped[key].amount += amount;
      }
    });

    Object.values(grouped).forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.mnemonic}</td>
        <td>${item.medsName}</td>
        <td>${item.amount}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  const orderDate = data[0]?.date;
  const dateDisplay = document.getElementById("dateDisplay");
  if (orderDate && dateDisplay) {
    const formattedDate = new Date(orderDate).toLocaleDateString("en-GB");
    dateDisplay.textContent = `DATE: ${formattedDate}`;
  }
}

function generatePDF() {
  window.scrollTo(0, 0);
  setTimeout(() => {
    const element = document.getElementById('a4-summary');
    const opt = {
      margin: [0, 0, 0, 0],
      filename: 'form-output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: [220, 460],
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };
    html2pdf().set(opt).from(element).save();
  }, 300);
}

function goBackToEdit() {
  window.location.href = "home.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function submitOrderAndDownload() {
  const reorderData = JSON.parse(localStorage.getItem("reorderData")) || [];
  const orderDate = localStorage.getItem("orderDate");
  const user = localStorage.getItem("loggedInUser");

  if (reorderData.length === 0 || !orderDate || !user) {
    alert("Missing order data. Please go back and review your order.");
    return;
  }

  const payload = reorderData.map(item => ({
    mnemonic: item.mnemonic,
    medsName: item.medsName,
    amount: parseInt(item.amount),
    date: new Date(orderDate).toISOString(),
    user: user
  }));

  console.log("📦 Submitting to backend:");
  console.table(payload);

  // 🔧 Submit to correct endpoint
  fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        console.warn("⚠️ Response not OK:", res.status);
        alert("⚠️ Some items failed to submit.");
      } else {
        generatePDF();
        // ✅ Optional: clear data
        localStorage.removeItem("reorderData");
        localStorage.removeItem("orderDate");
      }
    })
    .catch(err => {
      console.error("❌ Error submitting orders:", err);
      alert("Something went wrong. Is the backend running?");
    });
}
