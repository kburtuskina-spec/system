const params = new URLSearchParams(window.location.search);

const requestId = params.get("id");

if (!requestId) {

    alert("Не указана заявка.");

    location.href = "requests.html";

}

loadRequest();

async function loadRequest() {

    try {

        const response = await fetch(`/api/requests/${requestId}`);

        if (!response.ok)
            throw new Error();

        const request = await response.json();

        document.getElementById("breadcrumbs").textContent =
            `Заявки / № ${request.id}`;

        document.getElementById("requestTitle").textContent =
            `Заявка № ${request.id}`;

        document.getElementById("createdAt").textContent =
            request.created_at
                ? new Date(request.created_at).toLocaleDateString()
                : "-";

        document.getElementById("dueDate").textContent =
            request.due_date
                ? new Date(request.due_date).toLocaleDateString()
                : "-";

        document.getElementById("objectName").textContent =
            request.object_name || "-";

        const statusElement = document.getElementById("status");

statusElement.textContent = request.status || "-";

switch (request.status) {

    case "Создана":
        statusElement.style.color = "#2563eb";
        break;

    case "В работе":
        statusElement.style.color = "#f59e0b";
        break;

    case "Выполнена":
    case "Выполнено":
        statusElement.style.color = "#16a34a";
        break;

    default:
        statusElement.style.color = "#374151";

}

        document.getElementById("requester").textContent =
            request.requester || "-";

        document.getElementById("department").textContent =
            request.department || "-";

        document.getElementById("item").textContent =
            request.item || "-";

        document.getElementById("quantity").textContent =
            request.quantity || "-";

        document.getElementById("description").textContent =
            request.description || "-";

        document.getElementById("editBtn").onclick = () => {

            location.href =
                `request-edit.html?id=${request.id}`;

        };

    }

    catch (err) {

        console.error(err);

        alert("Не удалось загрузить заявку.");

        location.href = "requests.html";

    }

}
document
    .querySelector(".btn-delete-request")
    ?.addEventListener("click", deleteRequest);

async function deleteRequest() {

    if (!confirm("Удалить заявку?"))
        return;

    try {

        const response = await fetch(`/api/requests/${requestId}`, {

            method: "DELETE"

        });

        if (!response.ok)
            throw new Error();

        alert("Заявка удалена.");

        location.href = "requests.html";

    }

    catch (err) {

        console.error(err);

        alert("Не удалось удалить заявку.");

    }

}