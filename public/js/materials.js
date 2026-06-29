document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".btn-new-material")?.addEventListener("click", () => {

        location.href = "material-create.html";

    });

    document.getElementById("searchInput")?.addEventListener("keydown", (e) => {

        if (e.key === "Enter")
            loadMaterials();

    });

    document.getElementById("searchBtn")?.addEventListener("click", loadMaterials);

    loadMaterials();

});

async function loadMaterials() {

    try {

        const search =
            document.getElementById("searchInput")?.value || "";

        const params = new URLSearchParams();

        if (search)
            params.append("q", search);

        const response = await fetch(
            "/api/materials?" + params.toString()
        );

        if (!response.ok)
            throw new Error();

        const materials = await response.json();

        const tbody =
            document.getElementById("materialsBody");

        tbody.innerHTML = "";

        materials.forEach(material => {

            tbody.innerHTML += `

<tr>

<td>${material.code ?? "-"}</td>

<td>${material.name}</td>

<td>${material.unit}</td>

<td>${material.category ?? "-"}</td>

<td>${material.stock ?? 0}</td>

<td>

<button
class="secondary btn-edit"
data-id="${material.id}">
Редактировать
</button>

<button
class="secondary btn-delete"
data-id="${material.id}">
Удалить
</button>

</td>

</tr>

`;

        });

    }

    catch (err) {

        console.error(err);

        alert("Не удалось загрузить материалы.");

    }

}
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("btn-delete"))
        return;

    if (!confirm("Удалить материал?"))
        return;

    try {

        const response = await fetch(
            `/api/materials/${e.target.dataset.id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok)
            throw new Error();

        loadMaterials();

    }

    catch (err) {

        console.error(err);

        alert("Не удалось удалить материал.");

    }

});
document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("btn-edit"))
        return;

    location.href =
        `material-edit.html?id=${e.target.dataset.id}`;

});