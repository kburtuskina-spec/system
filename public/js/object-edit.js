const id = new URLSearchParams(location.search).get("id");

if (!id) {
    alert("Нет ID");
    location.href = "objects.html";
}

load();

async function load() {

    const res = await fetch(`/api/objects/${id}`);

    if (!res.ok) {
        alert("Ошибка загрузки");
        location.href = "objects.html";
        return;
    }

    const o = await res.json();

    document.getElementById("code").value = o.code ?? "";
    document.getElementById("name").value = o.name ?? "";
    document.getElementById("address").value = o.address ?? "";
    document.getElementById("customer").value = o.customer ?? "";
    document.getElementById("status").value = o.status ?? "";
}

document.getElementById("saveBtn").onclick = async () => {

    const body = {

        code: document.getElementById("code").value,
        name: document.getElementById("name").value,
        address: document.getElementById("address").value,
        customer: document.getElementById("customer").value,
        status: document.getElementById("status").value

    };

    const res = await fetch(`/api/objects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        alert("Ошибка сохранения");
        return;
    }

    location.href = "objects.html";
};