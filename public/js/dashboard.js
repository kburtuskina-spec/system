document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {

    try {

        const response = await fetch("/api/dashboard");

        if (!response.ok)
            throw new Error();

        const data = await response.json();

        // Карточки

        document.getElementById("totalRequests").textContent =
            data.stats.total;

        document.getElementById("inWorkRequests").textContent =
            data.stats.inWork;

        document.getElementById("completedRequests").textContent =
            data.stats.completed;

        document.getElementById("overdueRequests").textContent =
            data.stats.overdue;

        // Последние заявки

        const tbody =
            document.getElementById("latestRequests");

        tbody.innerHTML = "";

        data.latest.forEach(request => {

            tbody.innerHTML += `

<tr>

<td>${request.id}</td>

<td>${request.object_name ?? "-"}</td>

<td>${request.status}</td>

<td>${
    request.due_date
        ? new Date(request.due_date).toLocaleDateString()
        : "-"
}</td>

</tr>

`;

        });
        const notifications =
    document.getElementById("notifications");

if (notifications) {

    notifications.innerHTML = "";

    data.notifications.forEach(request => {

        let text = "";

        if (request.status === "Создана") {

            text =
                `🔵 Создана заявка №${request.id}`;

        } else if (request.status === "В работе") {

            text =
                `🟠 Заявка №${request.id} находится в работе`;

        } else if (
            request.status === "Выполнено" ||
            request.status === "Выполнена"
        ) {

            text =
                `🟢 Заявка №${request.id} выполнена`;

        } else {

            text =
                `ℹ️ Заявка №${request.id}`;

        }

        notifications.innerHTML += text + "<br>";

    });

}

    }

    catch (err) {

        console.error(err);

    }

}