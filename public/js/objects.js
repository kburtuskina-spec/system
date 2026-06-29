document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".btn-new-object").onclick = () => {
        location.href = "object-create.html";
    };

    document.getElementById("searchBtn").onclick = loadObjects;

    document.getElementById("resetBtn").onclick = () => {
        document.getElementById("searchInput").value = "";
        loadObjects();
    };

    loadObjects();
});

async function loadObjects() {

    const q = document.getElementById("searchInput").value;

    const url = q ? `/api/objects?q=${q}` : "/api/objects";

    const res = await fetch(url);

    const data = await res.json();

    const tbody = document.getElementById("objectsBody");

    tbody.innerHTML = "";

    data.forEach(o => {

        tbody.innerHTML += `
<tr>
<td>${o.code ?? "-"}</td>
<td>${o.name}</td>
<td>${o.address ?? "-"}</td>
<td>${o.customer ?? "-"}</td>
<td>${o.status ?? "-"}</td>
<td>
<button class="secondary btn-edit" data-id="${o.id}">
    Редактировать
</button>

<button class="secondary btn-delete" data-id="${o.id}">
    Удалить
</button>
</td>
</tr>
        `;
    });
}


// DELETE + EDIT (ОДИН ОБРАБОТЧИК — КАК В МАТЕРИАЛАХ)
document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("btn-delete")) {

        await fetch(`/api/objects/${e.target.dataset.id}`, {
            method: "DELETE"
        });

        loadObjects();
    }

    if (e.target.classList.contains("btn-edit")) {

        location.href = `object-edit.html?id=${e.target.dataset.id}`;
    }
});