// =======================================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// =======================================================

(async function checkAuth() {

    const page = location.pathname.split("/").pop();

    if (page === "login.html")
        return;

    try {

        const response = await fetch("http://localhost:3000/login/me", {

            credentials: "include"

        });

        if (!response.ok) {

            location.href = "login.html";

            return;

        }

        const user = await response.json();

        console.log("Авторизован:", user);

    }

    catch (err) {

        console.error(err);

        location.href = "login.html";

    }

})();


// =======================================================
// НАВИГАЦИЯ
// =======================================================

document.addEventListener("click", async (e) => {

    if (e.target.closest(".btn-new-request"))
        location.href = "request-create.html";

    if (e.target.closest(".btn-requests"))
        location.href = "requests.html";

    if (e.target.closest(".btn-new-object"))
        location.href = "objects.html";

    if (e.target.closest(".btn-new-material"))
        location.href = "materials.html";

    if (e.target.closest(".btn-new-user"))
        location.href = "users.html";

    if (e.target.closest(".btn-search-requests"))
        loadRequests();

    if (e.target.closest(".btn-logout")) {

        try {

            await fetch("http://localhost:3000/login/logout", {

                method: "POST",

                credentials: "include"

            });

        }

        catch (err) {

            console.error(err);

        }

        location.href = "login.html";

    }

});


// =======================================================
// СОЗДАНИЕ ЗАЯВКИ
// =======================================================

const form = document.querySelector("#form");

loadObjects();

loadMaterials();

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {

            requester:
                document.querySelector("[name=requester]").value,

            department:
                document.querySelector("[name=department]").value,

            object_id:
                document.querySelector("[name=object_id]").value || null,

            item:
                document.querySelector("[name=item]").value,

            quantity:
                document.querySelector("[name=quantity]").value,

            due_date:
                document.querySelector("[name=due_date]").value,

            completed_at:
                document.querySelector("[name=completed_at]").value || null,

            status:
                document.querySelector("[name=status]").value,

            description:
                document.querySelector("[name=description]").value

        };

        try {

            const response = await fetch(
                "http://localhost:3000/api/requests",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(data)

                }
            );

            const result = await response.json();

            if (!response.ok) {

                alert(result.error || "Ошибка сохранения");

                return;

            }

            alert("Заявка успешно создана");

            location.href = "requests.html";

        }

        catch (err) {

            console.error(err);

            alert("Ошибка подключения к серверу");

        }

    });

}
// =======================================================
// ЗАГРУЗКА СПИСКА ЗАЯВОК
// =======================================================

async function loadRequests() {

    const tbody = document.querySelector("#requestsTable tbody");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    try {

        const response = await fetch(
            "http://localhost:3000/api/requests",
            {
                credentials: "include"
            }
        );

        if (!response.ok)
            throw new Error();

        const requests = await response.json();

        requests.forEach(request => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${request.id}</td>

                <td>${
                    request.created_at
                        ? new Date(request.created_at).toLocaleDateString()
                        : "-"
                }</td>

                <td>${request.object_name ?? "-"}</td>

                <td>${request.requester}</td>

                <td>${request.item}</td>

                <td>${request.quantity}</td>

                <td>${request.status}</td>

                <td>${
                    request.due_date
                        ? new Date(request.due_date).toLocaleDateString()
                        : "-"
                }</td>

            `;

            tbody.appendChild(row);

        });

    }

    catch (err) {

        console.error(err);

    }

}

loadRequests();


// =======================================================
// ЗАГРУЗКА ОБЪЕКТОВ
// =======================================================

async function loadObjects() {

    const select =
        document.querySelector("[name=object_id]");

    if (!select)
        return;

    try {

        const response = await fetch(
            "http://localhost:3000/api/objects",
            {
                credentials: "include"
            }
        );

        if (!response.ok)
            throw new Error();

        const objects = await response.json();

        select.innerHTML =
            '<option value="">Выберите объект</option>';

        objects.forEach(object => {

            const option =
                document.createElement("option");

            option.value = object.id;

            option.textContent = object.name;

            select.appendChild(option);

        });

    }

    catch (err) {

        console.error(err);

    }

}


// =======================================================
// ЗАГРУЗКА МАТЕРИАЛОВ
// =======================================================

async function loadMaterials() {

    const select =
        document.querySelector("[name=item]");

    if (!select)
        return;

    try {

        const response = await fetch(
            "http://localhost:3000/api/materials",
            {
                credentials: "include"
            }
        );

        if (!response.ok)
            throw new Error();

        const materials = await response.json();

        select.innerHTML =
            '<option value="">Выберите материал</option>';

        materials.forEach(material => {

            const option =
                document.createElement("option");

            option.value = material.name;

            option.textContent =
                `${material.name} (${material.unit})`;

            select.appendChild(option);

        });

    }

    catch (err) {

        console.error(err);

    }

}
// =======================================================
// ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
// =======================================================

async function loadCurrentUser() {

    const userBlock = document.querySelector("#currentUser");

    if (!userBlock)
        return;

    try {

        const response = await fetch(
            "http://localhost:3000/login/me",
            {
                credentials: "include"
            }
        );

        if (!response.ok)
            return;

        const user = await response.json();

        userBlock.textContent =
            `${user.full_name} (${user.role})`;

    }

    catch (err) {

        console.error(err);

    }

}

loadCurrentUser();


// =======================================================
// ВЫХОД ИЗ СИСТЕМЫ
// =======================================================

async function logout() {

    try {

        await fetch(
            "http://localhost:3000/login/logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

    }

    catch (err) {

        console.error(err);

    }

    location.href = "login.html";

}


// =======================================================
// ОБРАБОТКА КНОПКИ ВЫХОДА
// =======================================================

document.addEventListener("click", function(e){

    const button = e.target.closest(".btn-logout");

    if(!button)
        return;

    logout();

});


// =======================================================
// ПРОВЕРКА СЕССИИ КАЖДЫЕ 5 МИНУТ
// =======================================================

setInterval(async ()=>{

    try{

        const response = await fetch(
            "http://localhost:3000/login/ping",
            {
                credentials:"include"
            }
        );

        if(!response.ok){

            location.href="login.html";

        }

    }

    catch{

        location.href="login.html";

    }

},300000);