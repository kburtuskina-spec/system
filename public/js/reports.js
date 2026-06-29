document.addEventListener("DOMContentLoaded", loadReports);

async function loadReports() {

    try {

        const res = await fetch('/api/reports');

        if (!res.ok)
            throw new Error("API error");

        const data = await res.json();

        // числа
        document.getElementById("objectsCount").textContent =
            data.objectsCount ?? 0;

        document.getElementById("requestsCount").textContent =
            data.requestsCount ?? 0;

        document.getElementById("activeRequests").textContent =
            data.activeRequests ?? 0;

        // таблица последних заявок
        const tbody = document.getElementById("lastRequests");

        tbody.innerHTML = "";

        (data.lastRequests || []).forEach(item => {

            tbody.innerHTML += `
<tr>
    <td>${item.id}</td>
    <td>${item.object_name ?? '-'}</td>
    <td>${item.status ?? '-'}</td>
</tr>
            `;

        });

    } catch (err) {

        console.error(err);

        alert("Ошибка загрузки отчётов");

    }
}