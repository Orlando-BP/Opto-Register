document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log("Intento de Login");

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

            const response = await fetch('JS/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'same-origin' // permite que la sesión se mantenga
            });
            
            const data = await response.json();
            
            if (data.success === true) {
                document.getElementById('message').textContent = 'Login exitoso!' ;
                window.location.href = 'dashboard.php';
            } else {
                console.log("Incorrecto");
                document.getElementById('message').textContent = 'Usuario o contraseña incorrectos.';
            }

    });
});
