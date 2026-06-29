document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".btn-new-user")?.addEventListener("click", () => {

        location.href = "user-create.html";

    });

    document.getElementById("searchBtn")?.addEventListener("click", loadUsers);

    document.getElementById("searchInput")?.addEventListener("keydown", (e) => {

        if (e.key === "Enter")
            loadUsers();

    });

    document.getElementById("resetBtn")?.addEventListener("click", () => {

        document.getElementById("searchInput").value = "";

        loadUsers();

    });

    loadUsers();

});

async function loadUsers() {

    try {

        const search =
            document.getElementById("searchInput")?.value || "";

        const params = new URLSearchParams();

        if (search)
            params.append("q", search);

        const response = await fetch(
            "/api/users?" + params.toString()
        );

        if (!response.ok)
            throw new Error();

        const users = await response.json();

        const tbody =
            document.getElementById("usersTable");

        tbody.innerHTML = "";

        users.forEach(user => {

            tbody.innerHTML += `

<tr>

<td>${user.login}</td>

<td>${user.full_name}</td>

<td>${user.role}</td>

<td>${user.department ?? "-"}</td>

<td>Активен</td>

<td>

<button
class="secondary btn-edit"
data-id="${user.id}">
Редактировать
</button>

<button
class="secondary btn-delete"
data-id="${user.id}">
Удалить
</button>

</td>

</tr>

`;

        });

    }

    catch (err) {

        console.error(err);

        alert("Не удалось загрузить пользователей.");

    }

}

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-edit")) {

        location.href =
            `user-edit.html?id=${e.target.dataset.id}`;

    }

});

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("btn-delete"))
        return;

    if (!confirm("Удалить пользователя?"))
        return;

    try {

        const response = await fetch(
            `/api/users/${e.target.dataset.id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok)
            throw new Error();

        loadUsers();

    }

    catch (err) {

        console.error(err);

        alert("Не удалось удалить пользователя.");

    }

});