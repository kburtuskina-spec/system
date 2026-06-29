const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    errorMessage.textContent = "";

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                login,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            errorMessage.textContent =
                data.error || "Неверный логин или пароль";

            return;

        }

        location.href = "index.html";

    }

    catch (err) {

        console.error(err);

        errorMessage.textContent =
            "Не удалось подключиться к серверу";

    }

});