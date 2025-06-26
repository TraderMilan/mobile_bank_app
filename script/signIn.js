document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sign-in");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = data.get("name");

        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (!users.includes(name)) {
            alert(`User ${name} does not exist.`);
            return;
        }

        localStorage.setItem("currentUser", name);
        window.location.href = "../pages/app.html";
    });
});
