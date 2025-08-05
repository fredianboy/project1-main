// Toggle input field when checkbox is clicked
function toggleInput(checkbox) {
    const row = checkbox.closest("tr");
    const input = row.querySelector('input[type="number"]');
    input.readOnly = !checkbox.checked;
    if (checkbox.checked) {
        input.classList.add("editable");
        input.focus();
    } else {
        input.classList.remove("editable");
        input.value = "";
    }
}

//---------------------------------------------------------------------------------------------------------//
document.addEventListener("DOMContentLoaded", function () {

    const numberInputs = document.querySelectorAll('input[type="number"]');

    numberInputs.forEach((input) => {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                input.blur();
            }
        });

        input.addEventListener("input", function () {
            input.value = input.value.replace(/\D/g, '');
            if (input.value.length > 3) {
                input.value = input.value.slice(0, 3);
            }
        });

        input.addEventListener("paste", function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData("text");
            const sanitized = paste.replace(/\D/g, '').slice(0, 4);
            document.execCommand("insertText", false, sanitized);
        });
    });

    // ✅ Restore previous reorderData if available
    const savedData = JSON.parse(localStorage.getItem("reorderData")) || [];

    if (savedData.length > 0) {
        const rows = document.querySelectorAll("tr");

        savedData.forEach(item => {
            rows.forEach(row => {
                const mnemonicCell = row.querySelector(".mnemonic");
                const medsNameCell = row.querySelector(".medsName");
                const input = row.querySelector('input[type="number"]');
                const checkbox = row.querySelector('input[type="checkbox"]');

                if (
                    mnemonicCell && medsNameCell &&
                    mnemonicCell.textContent.trim() === item.mnemonic &&
                    medsNameCell.textContent.trim() === item.medsName
                ) {
                    checkbox.checked = true;
                    input.readOnly = false;
                    input.classList.add("editable");
                    input.value = item.amount;
                }
            });
        });
    }

    // ✅ Restore previously selected date
    const savedDate = localStorage.getItem("orderDate");
    if (savedDate) {
        const dateField = document.getElementById("dateValue");
        if (dateField) dateField.value = savedDate;
    }

    // ✅ Show previous order history in .prevData
    showPreviousOrders();

   const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
    const welcomeEl = document.getElementById("welcome-message");
    if (welcomeEl) {
        welcomeEl.textContent = `Welcome, ${loggedInUser}!`;
      }
    } 


    const dateField = document.getElementById("dateValue");
if (dateField) {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // handle local time offset
    const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
    dateField.min = localISOTime;

    const savedDate = localStorage.getItem("orderDate");
    if (savedDate) {
        dateField.value = savedDate;
    }
}

});

// ---------------------------------------------------------------------------------------------------------//
function validateForm() {
    const dateValue = document.getElementById("dateValue").value;
    if (!dateValue) {
        alert("Please select an order date.");
        return false;
    }

    const checkedRows = document.querySelectorAll('input[type="checkbox"]:checked');
    if (checkedRows.length === 0) {
        alert("Please select at least one item to reorder.");
        return false;
    }

    const orderData = [];

    checkedRows.forEach(checkbox => {
        const row = checkbox.closest("tr");
        const mnemonic = row.querySelector(".mnemonic")?.textContent.trim();
        const medsName = row.querySelector(".medsName")?.textContent.trim();
        const amount = row.querySelector('input[type="number"]').value.trim();
        const user = localStorage.getItem("loggedInUser");

        if (mnemonic && medsName && amount) {
            orderData.push({ mnemonic, medsName, amount, date: dateValue, user});
        }
    });

    // ✅ Save current order
    localStorage.setItem("orderDate", dateValue);
    localStorage.setItem("reorderData", JSON.stringify(orderData));

    // ✅ Append to history
    const previousData = JSON.parse(localStorage.getItem("reorderHistory")) || [];
    previousData.push(...orderData);
    localStorage.setItem("reorderHistory", JSON.stringify(previousData));

    // ✅ Redirect
    window.location.href = "table.html";
    return false;
}

function clearFormData() {
    localStorage.removeItem("orderDate");
    localStorage.removeItem("reorderData");

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const numberInputs = document.querySelectorAll('input[type="number"]');

    checkboxes.forEach(cb => {
        cb.checked = false;
    });

    numberInputs.forEach(input => {
        input.value = "";
        input.readOnly = true;
        input.classList.remove("editable");
    });

    const dateField = document.getElementById("dateValue");
    if (dateField) {
        dateField.value = "";
    }

    alert("Form has been cleared.");
}

// ---------------------------------------------------------------------------------------------------------//
function showPreviousOrders() {
    const history = JSON.parse(localStorage.getItem("reorderHistory")) || [];
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const grouped = {};
    history.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= oneMonthAgo) {
            if (!grouped[entry.mnemonic]) grouped[entry.mnemonic] = [];
            grouped[entry.mnemonic].push({
                date: entry.date,
                amount: entry.amount,
                user: entry.user || "Unknown"
            });
        }
    });

    document.querySelectorAll("tr").forEach(row => {
        const mnemonic = row.querySelector(".mnemonic")?.textContent.trim();
        const prevDataCell = row.querySelector(".prevData");

        if (mnemonic && prevDataCell) {
            const historyEntries = grouped[mnemonic] || [];
            if (historyEntries.length > 0) {
                const latest = historyEntries[historyEntries.length - 1];

                const formattedDate = new Date(latest.date).toLocaleString("en-GB", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                });

                prevDataCell.textContent = `Last: ${formattedDate} by ${latest.user} [Qty: ${latest.amount}]`;
            } else {
                prevDataCell.textContent = "No recent orders";
            }
        }
    });
}




function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}
