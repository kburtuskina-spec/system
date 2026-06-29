document.addEventListener("DOMContentLoaded", () => {

    loadRequests();

    document.querySelector(".btn-new-request")?.addEventListener("click", () => {
        location.href = "request-create.html";
    });
document.querySelector(".btn-export")?.addEventListener("click", () => {

    const search =
        document.getElementById("searchInput")?.value || "";

    const status =
        document.getElementById("statusFilter")?.value || "";

    const params = new URLSearchParams();

    if (search)
        params.append("q", search);

    if (status)
        params.append("status", status);

    params.append("export", "csv");

    window.open(
        "/api/requests?" + params.toString(),
        "_blank"
    );

});
    document.getElementById("searchBtn")?.addEventListener("click", loadRequests);
document.getElementById("searchInput")?.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        loadRequests();

    }

});
document.getElementById("statusFilter")?.addEventListener("change", () => {

    loadRequests();

});
    document.getElementById("resetBtn")?.addEventListener("click", () => {

        document.getElementById("searchInput").value = "";
        document.getElementById("statusFilter").value = "";

        loadRequests();

    });

});

async function loadRequests() {

    try {

        const search =
            document.getElementById("searchInput")?.value || "";

        const status =
            document.getElementById("statusFilter")?.value || "";

        const params = new URLSearchParams();

        if (search)
            params.append("q", search);

        if (status)
            params.append("status", status);

        const response = await fetch(
            "/api/requests?" + params.toString()
        );

        if (!response.ok)
            throw new Error();

        const requests = await response.json();

        const tbody =
            document.querySelector("#requestsTable tbody");

        tbody.innerHTML = "";

        requests.forEach(request => {

            tbody.innerHTML += `
<tr>

<td>${request.id}</td>

<td>${new Date(request.created_at).toLocaleDateString()}</td>

<td>${request.object_name ?? "-"}</td>

<td>${request.requester}</td>

<td>${request.item}</td>

<td>${request.quantity}</td>

<td>${request.status}</td>

<td>${request.due_date
    ? new Date(request.due_date).toLocaleDateString()
    : "-"}</td>

<td>

<button
class="secondary btn-view"
data-id="${request.id}">
Просмотр
</button>

</td>

</tr>
`;

        });

    }

    catch (err) {

        console.error(err);

    }

}

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-view")) {

        const id = e.target.dataset.id;

        location.href = `request-view.html?id=${id}`;

    }

});