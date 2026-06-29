const params = new URLSearchParams(window.location.search);

const userId = params.get("id");

if (!userId) {

    alert("Не указан пользователь.");

    location.href = "users.html";

}

document
    .getElementById("saveBtn")
    .addEventListener("click", saveUser);

loadUser();

async function loadUser() {

    try {

        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok)
            throw new Error();

        const user = await response.json();

        document.getElementById("login").value =
            user.login;

        document.getElementById("fullName").value =
            user.full_name;

        document.getElementById("role").value =
            user.role;

        document.getElementById("department").value =
            user.department ?? "";

    }

    catch (err) {

        console.error(err);

        alert("Не удалось загрузить пользователя.");

        location.href = "users.html";

    }

}

async function saveUser() {

    const data = {

        login:
            document.getElementById("login").value,

        full_name:
            document.getElementById("fullName").value,

        role:
            document.getElementById("role").value,

        department:
            document.getElementById("department").value

    };

    try {

        const response = await fetch(`/api/users/${userId}`, {

            method: "PUT",

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

        alert("Пользователь успешно обновлен.");

        location.href = "users.html";

    }

    catch (err) {

        console.error(err);

        alert("Ошибка сервера.");

    }

}