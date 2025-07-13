  // Hardcoded credentials
        const credentials = [
            { username: "admin", password: "password123", name: "Fred Hortilano" },
            { username: "user1", password: "welcome1", name: "Mayena Aguilar" },
            { username: "testuser", password: "test2025", name: "Abdel Arani" },
            { username: "guest", password: "guestpass", name: "Jaypee Bacalla" },
            { username: "pharmacy", password: "pharmacy2025", name: "Grace Villareal" },
            { username: "pharmacist", password: "pharmacist2025", name: "Jakki Ygoña" },
            { username: "staff", password: "staff2025", name: "Phillip Deppler" },
            { username: "admin2", password: "adminpass", name: "Fatima Fofana" }    
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
              localStorage.setItem('loggedInUser', matchedUser.name); // ✅ Save name, not just username
              window.location.href = 'index.html';
            } else {
              errorMessage.textContent = 'Invalid username or password';
              errorMessage.style.display = 'block';
            }

        });