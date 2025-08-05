document.addEventListener("DOMContentLoaded", function () {
    const reorderData = JSON.parse(localStorage.getItem("reorderData")) || [];
    const tableBody = document.querySelector("#summary-table tbody");
    const loggedInUser = localStorage.getItem('loggedInUser');
    const orderedByInput = document.getElementById('myInput');

    // Auto-fill "Ordered By" with logged-in user's name
    if (loggedInUser && orderedByInput) {
        orderedByInput.value = loggedInUser;
        orderedByInput.readOnly = true; 
    }

    if (!tableBody) return;

    if (reorderData.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="3">No reorder data available.</td>`;
        tableBody.appendChild(row);
    } else {
        reorderData.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.mnemonic}</td>
                <td>${item.medsName}</td>
                <td>${item.amount}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Display order date better format
    const orderDate = localStorage.getItem("orderDate");
    const dateDisplay = document.getElementById("dateDisplay");

    if (orderDate && dateDisplay) {
        const formattedDate = new Date(orderDate).toLocaleDateString("en-GB");
        dateDisplay.textContent = `DATE: ${formattedDate}`;
    } else if (dateDisplay) {
        dateDisplay.textContent = "DATE: (Not provided)";
    }
});


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
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}
