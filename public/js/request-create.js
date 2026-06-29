document.addEventListener("DOMContentLoaded", init);

async function init() {

    setCurrentDate();

    await loadCurrentUser();

    await loadObjects();
    await loadMaterials();

    const form = document.getElementById("form");

    form.addEventListener("submit", saveRequest);

    document
        .querySelector(".btn-cancel")
        .addEventListener("click", () => {

            location.href = "requests.html";

        });

}

function setCurrentDate() {

    document.querySelector("[name=created_at]").value =
        new Date().toISOString().split("T")[0];

}
async function loadCurrentUser() {

    try {

        const response = await fetch("/login/me");

        if (!response.ok)
            throw new Error();

        const user = await response.json();

        document.querySelector("[name=requester]").value =
            user.full_name;

        document.querySelector("[name=department]").value =
            user.department;

    }

    catch (err) {

        console.error(err);

        alert("Не удалось получить данные пользователя.");

    }

}
async function loadObjects() {

    try {

        const response = await fetch("/api/objects");

        if (!response.ok)
            throw new Error();

        const objects = await response.json();

        const select =
            document.querySelector("[name=object_id]");

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

        alert("Не удалось загрузить объекты.");

    }

}
async function saveRequest(event) {

    event.preventDefault();

    const data = {

        requester: document.querySelector("[name=requester]").value,

        department: document.querySelector("[name=department]").value,

        object_id: document.querySelector("[name=object_id]").value || null,

        item: document.querySelector("[name=item]").value,

        quantity: Number(
            document.querySelector("[name=quantity]").value
        ),

        due_date: document.querySelector("[name=due_date]").value,

        completed_at: null,

        status: "Создана",

        description: document.querySelector("[name=description]").value

    };

    try {

        const response = await fetch("/api/requests", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {

            console.error(result);

            throw new Error(result.error || "Ошибка");

        }

        alert("Заявка успешно создана.");

        location.href = "requests.html";

    }

    catch (err) {

        console.error(err);

        alert("Не удалось сохранить заявку.");

    }

}
async function loadMaterials() {

    try {

        const response = await fetch("/api/materials");

        if (!response.ok)
            throw new Error();

        const materials = await response.json();

        const select = document.querySelector("[name=item]");

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

        alert("Не удалось загрузить материалы.");

    }

}