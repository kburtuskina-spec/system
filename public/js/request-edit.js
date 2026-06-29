const params = new URLSearchParams(window.location.search);

const requestId = params.get("id");

if (!requestId) {

    alert("Не указана заявка.");

    location.href = "requests.html";

}

document.addEventListener("DOMContentLoaded", init);

async function init() {

    await loadRequest();

    await loadObjects();

    await loadMaterials();

    document.querySelector("[name=object_id]").value =
        window.currentRequest.object_id || "";

    document.querySelector("[name=item]").value =
        window.currentRequest.item || "";

    document
        .getElementById("form")
        .addEventListener("submit", updateRequest);

}

async function loadRequest() {

    const response =
        await fetch(`/api/requests/${requestId}`);

    if (!response.ok)
        throw new Error();

    const request = await response.json();

    window.currentRequest = request;

    document.querySelector("[name=created_at]").value =
        request.created_at
            ? request.created_at.split("T")[0]
            : "";

    document.querySelector("[name=due_date]").value =
        request.due_date
            ? request.due_date.split("T")[0]
            : "";

    document.querySelector("[name=requester]").value =
        request.requester;

    document.querySelector("[name=department]").value =
        request.department;

    document.querySelector("[name=status]").value =
        request.status;

    document.querySelector("[name=quantity]").value =
        request.quantity;

    document.querySelector("[name=description]").value =
        request.description || "";

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

async function loadMaterials() {

    try {

        const response = await fetch("/api/materials");

        if (!response.ok)
            throw new Error();

        const materials = await response.json();

        const select =
            document.querySelector("[name=item]");

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
async function updateRequest(event) {

    event.preventDefault();

    const data = {

        requester: document.querySelector("[name=requester]").value,

        department: document.querySelector("[name=department]").value,

        object_id: Number(
            document.querySelector("[name=object_id]").value
        ),

        item: document.querySelector("[name=item]").value,

        quantity: Number(
            document.querySelector("[name=quantity]").value
        ),

        due_date: document.querySelector("[name=due_date]").value,

        status: document.querySelector("[name=status]").value,

        description: document.querySelector("[name=description]").value

    };

    try {

        const response = await fetch(`/api/requests/${requestId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {

            console.error(result);

            throw new Error();

        }

        alert("Заявка успешно обновлена.");

        location.href = `request-view.html?id=${requestId}`;

    }

    catch (err) {

        console.error(err);

        alert("Не удалось сохранить изменения.");

    }

}