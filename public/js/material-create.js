document
    .getElementById("saveBtn")
    .addEventListener("click", saveMaterial);

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

        const response = await fetch("/api/materials", {

            method: "POST",

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

        alert("Материал успешно создан.");

        location.href = "materials.html";

    }

    catch (err) {

        console.error(err);

        alert("Ошибка сервера.");

    }

}