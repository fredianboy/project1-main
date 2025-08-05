// Hard-Code Creds
const credentials = [
    { username: "admin", password: "password123", name: "Fred" },
    { username: "user1", password: "welcome1", name: "Mayena" },
    { username: "testuser", password: "test2025", name: "Abdel" },
    { username: "guest", password: "guestpass", name: "Jaypee" },
    { username: "pharmacy", password: "pharmacy2025", name: "Grace" },
    { username: "pharmacist", password: "pharmacist2025", name: "Jakki" },
    { username: "boss", password: "finalboss", name: "Phillip" },
    { username: "user2", password: "user2pass", name: "Fatima" }    
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
        // 🔁 Clear any previous form data when logging in
        localStorage.removeItem("orderDate");
        localStorage.removeItem("reorderData");

        // ✅ Save logged-in user and redirect
        localStorage.setItem('loggedInUser', matchedUser.name);
        window.location.href = 'home.html';
    } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.style.display = 'block';
    }
});
