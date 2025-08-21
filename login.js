// Hard-Code Creds
const credentials = [
    { username: "admin", password: "password123!2", name: "Admin" },
    { username: "MAguilar", password: "Hospital1", name: "Mayena" },
    { username: "AArani", password: "aarani", name: "Abdel" },
    { username: "JBacalla", password: "Hospital1", name: "Jaypee" },
    { username: "MVillareal", password: "Hospital1", name: "Grace" },
    { username: "JYgona", password: "686868", name: "Jakki" },
    { username: "PDeppler", password: "Manager1", name: "Phillip" },
    { username: "FFofana", password: "Hospital1", name: "Fatima" },
    { username: "FHortilano", password: "Asakura123!", name: "Fred" }
    
];

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Check if entered credentials match any in the list
    const matchedUser = credentials.find(
        cred => cred.username === username && cred.password === password
    );

    if (matchedUser) {
    // Clear any previous form data when logging in
    localStorage.removeItem("orderDate");
    localStorage.removeItem("reorderData");

    // Save logged-in user
    localStorage.setItem('loggedInUser', matchedUser.name);
    localStorage.setItem('user', matchedUser.username); // NEW: this is needed for filtering

    // Redirect
    window.location.href = 'home.html';
    }

    else {
    errorMessage.textContent = "Invalid username or password.";
    errorMessage.style.display = "block";
    }
});
