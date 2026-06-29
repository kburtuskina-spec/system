document
    .getElementById("saveBtn")
    .addEventListener("click", saveObject);

async function saveObject() {

    const data = {

        code:
            document.getElementById("code").value,

        name:
            document.getElementById("name").value,

        address:
            document.getElementById("address").value,

        customer:
            document.getElementById("customer").value,

        status:
            document.getElementById("status").value

    };

    try {

        const response = await fetch("/api/objects", {

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

        alert("Объект успешно создан.");

        location.href = "objects.html";

    }

    catch (err) {

        console.error(err);

        alert("Ошибка сервера.");

    }

}