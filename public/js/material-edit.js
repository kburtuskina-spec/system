const params = new URLSearchParams(window.location.search);

const materialId = params.get("id");

if (!materialId) {

    alert("Не указан материал.");

    location.href = "materials.html";

}

document
    .getElementById("saveBtn")
    .addEventListener("click", saveMaterial);

loadMaterial();

async function loadMaterial() {

    try {

        const response = await fetch(`/api/materials/${materialId}`);

        if (!response.ok)
            throw new Error();

        const material = await response.json();

        document.getElementById("code").value =
            material.code ?? "";

        document.getElementById("name").value =
            material.name;

        document.getElementById("unit").value =
            material.unit;

        document.getElementById("category").value =
            material.category ?? "";

        document.getElementById("stock").value =
            material.stock ?? 0;

    }

    catch (err) {

        console.error(err);

        alert("Не удалось загрузить материал.");

        location.href = "materials.html";

    }

}

async function saveMaterial() {

    const data = {

        code:
            document.getElementById("code").value,

        name:
            document.getElementById("name").value,

        unit:
            document.getElementById("unit").value,

        category:
            document.getElementById("category").value,

        stock:
            Number(document.getElementById("stock").value)

    };

    try {

        const response = await fetch(`/api/materials/${materialId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.error || "Ошибка");

            return;

        }

        alert("Материал успешно обновлен.");

        location.href = "materials.html";

    }

    catch (err) {

        console.error(err);

        alert("Ошибка сервера.");

    }

}