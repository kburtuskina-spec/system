document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await fetch("/login/me");

        if (!response.ok) {

            if (!location.pathname.endsWith("login.html")) {

                location.href = "login.html";

            }

            return;

        }

        const user = await response.json();

        const currentUser =
            document.getElementById("currentUser");

        if (currentUser) {

            currentUser.textContent =
                `${user.full_name} (${user.role})`;

        }

        const logoutBtn =
            document.getElementById("logoutBtn");

        if (logoutBtn) {

            logoutBtn.addEventListener("click", async () => {

                await fetch("/login/logout", {
                    method: "POST"
                });

                location.href = "login.html";

            });

        }

    }

    catch (err) {

        console.error(err);

    }

});