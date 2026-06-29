document
    .getElementById("saveBtn")
    .addEventListener("click", saveUser);

async function saveUser() {

    const data = {

        login:
            document.getElementById("login").value,

        password:
            document.getElementById("password").value,

        full_name:
            document.getElementById("fullName").value,

        role:
            document.getElementById("role").value,

        department:
            document.getElementById("department").value

    };

    try {

        const response = await fetch("/api/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.error || "Ошибка");

            return;

        }

        alert("Пользователь успешно создан.");

        location.href = "users.html";

    }

    catch (err) {

        console.error(err);

        alert("Ошибка сервера.");

    }

}