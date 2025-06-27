document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-account");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = data.get("name");

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userData = JSON.parse(localStorage.getItem("userData")) || {};

        if (users.includes(name)) {
            alert(`User ${name} already exists.`);
            return;
        }

        users.push(name);
        userData[name] = {
            name,
            account: {
                accountNumber: Math.floor(Math.random() * 999999999) + 100000000,
                balance: 0,
                transitionHistory: []
            }
        };

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("currentUser", name);

        window.location.href = "../pages/app.html";
    });



});