// main.js
import {Account, Transaction, Client} from "./entities.js";

document.addEventListener("DOMContentLoaded", () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    const name = localStorage.getItem("currentUser");
    const userNameElement = document.getElementById("user-name");
    userNameElement.innerText = name;

    const currentUserData = userData[name];
    let user = new Client(
        name,
        new Account(
            currentUserData?.account?.balance || 0,
            currentUserData?.account?.transitionHistory || [],
            currentUserData?.account?.accountNumber
        )
    );

    const account = user.account;
    const accountNumberElement = document.getElementById("account-number");
    accountNumberElement.innerText = "SK" + account.accountNumber;

    const {income: calcIncome, expanse: calcExpense} = calculateProfitExpanse(account);
    let income = calcIncome;
    let expense = calcExpense;

    const incomeElement = document.getElementById("income");
    const expenseElement = document.getElementById("expense");
    const totalSum = document.querySelector(".total-sum");
    const balanceElement = document.querySelector(".balance");


    balanceElement.innerText = account.balance + "€";

    function saveData() {
        userData[name] = user.exportData();
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    function updateUI() {
        incomeElement.innerText = income;
        expenseElement.innerText = expense;
        totalSum.innerText = (income - expense) + "€";
        balanceElement.innerText = account.balance + "€";
    }

    function updateGraph(income, expense) {
        const progress = document.querySelector(".progress");
        const length = progress.getTotalLength();
        const ratio = income / (income + expense || 1);

        progress.style.transition = "stroke-dashoffset 1.5s ease";
        progress.style.strokeDasharray = `${length}px`;
        progress.style.strokeDashoffset = `${length * (1 - ratio)}px`;
    }

    function calculateProfitExpanse(account) {
        let income = 0, expanse = 0;

        for (let transaction of account.transitionHistory) {
            if (transaction.type === "income") {
                income += transaction.amount;
            }
            if (transaction.type === "expanse") {
                expanse += transaction.amount;
            }
        }

        return {income, expanse};
    }

    function printTransactionHistory(account) {
        let transactionsWrapper = document.querySelector(".transitions-wrapper");
        transactionsWrapper.innerHTML = "";
        if (account.transitionHistory.length === 0) {
            transactionsWrapper.innerHTML = `<div class="light" style="text-align: center; font-size: 12px">---No transaction history---</div>`;
        }
        for (let transaction of account.transitionHistory) {
            let element = addTransactionElement(transaction);
            transactionsWrapper.prepend(element);

        }
    }

    function addTransactionElement(transaction) {
        let date = new Date(transaction.date).toLocaleString();
        let type = transaction.type;
        let amount = transaction.amount;

        let transactionElement = document.createElement("div");
        transactionElement.classList.add("transition");
        transactionElement.innerHTML = `<svg id='Transaction_24' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'
                 xmlns:xlink='http://www.w3.org/1999/xlink'>
                <rect width='24' height='24' stroke='none' fill='currentColor' opacity='0'/>
                <g transform="matrix(1 0 0 1 12 12)">
                    <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: currentColor; fill-rule: nonzero; opacity: 1;"
                          transform=" translate(-12, -12)"
                          d="M 12 2 C 8.4698803 2 5.3751076 3.8338555 3.5957031 6.5957031 L 2 5 L 2 10 L 7 10 L 5.0546875 8.0546875 C 6.4299889 5.6361564 9.0193417 4 12 4 C 16.418 4 20 7.582 20 12 C 20 16.418 16.418 20 12 20 C 11.404 20 10.811328 19.934687 10.236328 19.804688 L 9.796875 21.755859 C 10.515875 21.917859 11.257 22 12 22 C 17.523 22 22 17.523 22 12 C 22 6.477 17.523 2 12 2 z M 11.712891 6 L 11.712891 7.078125 C 11.373891 7.121125 9.4765625 7.4775781 9.4765625 9.7675781 C 9.4765625 13.108578 12.935547 12.120609 12.935547 14.349609 C 12.935547 15.465609 12.213406 15.492188 12.066406 15.492188 C 11.932406 15.492188 11.052734 15.563469 11.052734 13.855469 L 9.1621094 13.855469 C 9.1621094 16.747469 11.260266 16.976531 11.572266 17.019531 L 11.572266 18 L 12.574219 18 L 12.574219 17.019531 C 12.912219 16.977531 14.824219 16.663937 14.824219 14.335938 C 14.824219 11.129938 11.366234 11.743344 11.365234 9.7773438 C 11.365234 8.6503437 11.985141 8.6152344 12.119141 8.6152344 C 12.364141 8.6152344 12.947266 8.830125 12.947266 10.203125 L 14.837891 10.203125 C 14.837891 7.576125 13.041703 7.1664687 12.720703 7.1054688 L 12.720703 6 L 11.712891 6 z M 2 12 L 2.0019531 12.158203 C 2.0129531 12.900203 2.1062969 13.639469 2.2792969 14.355469 L 4.2246094 13.888672 C 4.0856094 13.315672 4.0109531 12.721953 4.0019531 12.126953 L 4 12 L 2 12 z M 4.828125 15.552734 L 3.0371094 16.443359 C 3.3671094 17.104359 3.7702813 17.732641 4.2382812 18.306641 L 5.7890625 17.044922 C 5.4150625 16.584922 5.092125 16.082734 4.828125 15.552734 z M 7.0546875 18.289062 L 5.8164062 19.859375 C 6.3994063 20.318375 7.0322188 20.71325 7.6992188 21.03125 L 8.5605469 19.226562 C 8.0265469 18.971562 7.5206875 18.656063 7.0546875 18.289062 z"
                          stroke-linecap="round"/>
                </g>
            </svg>
            <div>
                <h3>${type}</h3>
                <div class="light">${date}</div>
            </div>
            <div class="price">
                ${amount} €
            </div>`
        return transactionElement
    }


    // Deposit
    const topUp = document.getElementById("top-up");
    const depositBody = document.getElementById("deposit");
    const depositForm = document.getElementById("add-money");

    topUp.addEventListener("click", () => {
        depositBody.style.display = "flex";
    });

    depositForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(depositForm);
        const amount = parseFloat(data.get("amount"));
        if (isNaN(amount) || amount <= 0) return;
        if (amount > 100000) {
            alert(`Slow down ${user.name}!`)
            return;
        }

        user.depositMoney(amount);
        income += amount;
        updateUI();
        updateGraph(income, expense);
        saveData();
        depositBody.style.display = "none";
        printTransactionHistory(account);
    });

    // Withdraw
    const withdraw = document.getElementById("withdraw");
    const withdrawBody = document.getElementById("withdraw-form");
    const withdrawForm = document.getElementById("withdraw-money");
    let copyVerificationCode;

    withdraw.addEventListener("click", () => {
        withdrawBody.style.display = "flex";
        copyVerificationCode = verificationCode.innerText
    });

    withdrawForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(withdrawForm);
        const amount = parseFloat(data.get("amount-w"));
        const v_code = parseFloat(data.get("v-code"))
        if (isNaN(amount) || amount <= 0) return;
        if (!user.withdrawMoney(amount)) {
            alert("Not enough money");
            return;
        }
        if (+v_code !== +copyVerificationCode){
            alert(`Wrong verification code, check your card!`)
            return;
        }

        expense += amount;
        updateUI();
        updateGraph(income, expense);
        saveData();
        withdrawBody.style.display = "none";
        printTransactionHistory(account);
    });

    // Send
    const send = document.getElementById("send");
    const sendBody = document.getElementById("send-form");
    const sendForm = document.getElementById("send-money");
    const sendTo = document.getElementById("send-to");

    send.addEventListener("click", () => {
        sendTo.innerHTML = "";
        if (users.filter(u => u !== name).length === 0) {
            sendForm.innerHTML = `To transfer money among more accounts, please 
            <a style="margin-bottom: 40px" href="../pages/create.html">create another account</a>`;
        }
        users.filter(u => u !== name).forEach(u => {
            const option = document.createElement("option");
            option.value = u;
            option.innerText = u;
            sendTo.appendChild(option);
        });
        sendBody.style.display = "flex";
    });

    sendForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(sendForm);
        const amount = parseFloat(data.get("amount-s"));
        const recipientName = data.get("send-to");

        if (isNaN(amount) || amount <= 0 || !recipientName) return;
        if (!user.withdrawMoney(amount)) {
            alert("Not enough money");
            return;
        }

        if (!userData[recipientName]) return alert("Recipient not found!");

        const recipient = new Client(
            recipientName,
            new Account(
                userData[recipientName].account.balance,
                userData[recipientName].account.transitionHistory,
                userData[recipientName].account.accountNumber
            )
        );
        recipient.depositMoney(amount);

        userData[name] = user.exportData();
        userData[recipientName] = recipient.exportData();
        localStorage.setItem("userData", JSON.stringify(userData));

        expense += amount;
        updateUI();
        updateGraph(income, expense);

        sendBody.style.display = "none";
        printTransactionHistory(account);
    });

    //INVOICE
    const invoiceButton = document.getElementById("invoice");
    const invoiceWrapper = document.getElementById("invoice-wrapper");
    let invoiceBody = document.querySelector("#invoice-wrapper .formular ");
    invoiceButton.addEventListener("click", (e) => {

        if (account.transitionHistory.length === 0) {
            console.log(invoiceBody);
            invoiceBody.innerHTML += "<div style='margin-bottom: 20px' class=\"light\">---No transactions---</div>";
        } else {
            let transactionDataWrapper = document.createElement("div");
            transactionDataWrapper.classList.add("transaction-data-wrapper");
            transactionDataWrapper.style.marginBottom = "20px";
            account.transitionHistory.forEach(t => {
                transactionDataWrapper.innerHTML += `
                <div class="transaction-data">
                <div>${new Date(t.date).toLocaleString()}</div>
                <div>${t.type}</div>
                <div>${t.amount} €</div>
            </div>
                `
            })
            invoiceBody.appendChild(transactionDataWrapper);
        }


        invoiceWrapper.style.display = "flex";
    })


    //LOG OUT
    const logOut = document.querySelector(".log-out");
    logOut.addEventListener("click", (e) => {
        window.location.href = "../pages/signIn.html";
    })

    //CREDIT CARD
    const cardNumber = document.getElementById("card-number");
    cardNumber.innerText = account.accountNumber;
    const cardName = document.getElementById("card-name");
    cardName.innerText = user.name;
    const verificationCode = document.getElementById("code");
    verificationCode.innerText = Math.floor(Math.random() * 899) + 100;

    document.getElementById("copy").addEventListener('click', (e) => {
        const text = verificationCode.innerText;
        navigator.clipboard.writeText(text)
            .then(() => alert("Skopírované do schránky!"))
            .catch(err => console.error("Chyba pri kopírovaní:", err));
    })

    //SWITCH
    let index = 0;

    function switchSlide(i) {
        index = i;
        const switchBody = document.querySelector('.switch-body');

        switchBody.style.transform = `translateX(-${index * 50}%)`;
    }


    const switchWrapper = document.querySelector('.switch-wrapper');
    const accountSwitchButton = document.getElementById("account-switch");
    const cardSwitchButton = document.getElementById("card-switch");

    cardSwitchButton.addEventListener("click", (e) => {
        switchSlide(1)
        let current = document.querySelector('.switch div:nth-child(1)');
        current.style.backgroundColor = "transparent";
        let other = document.querySelector('.switch div:nth-child(2)');
        other.style.backgroundColor = "#f1f1f1";
        switchWrapper.style.height = 160 + "px"
        switchWrapper.style.minHeight = 160 + "px";

    })
    accountSwitchButton.addEventListener("click", (e) => {
        switchSlide(0)
        let current = document.querySelector('.switch div:nth-child(2)');
        current.style.backgroundColor = "transparent";
        let other = document.querySelector('.switch div:nth-child(1)');
        other.style.backgroundColor = "#f1f1f1";
        switchWrapper.style.height = 100 + "px"
        switchWrapper.style.minHeight = 100 + "px"
    })

    //VIEW ALL
    const viewAllButton = document.querySelector(".view-all");
    const bottomWrapper = document.querySelector('.bottom');
    viewAllButton.addEventListener("click", (e) => {

        if (viewAllButton.innerHTML === 'View all') {
            bottomWrapper.style.height = 400 + "px";
            bottomWrapper.style.maxHeight = 80 + "vh";
            viewAllButton.innerHTML = 'Hide'
            setTimeout(() =>{
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 300)

        } else {
            viewAllButton.innerHTML = 'View all'
            bottomWrapper.style.height = 200 + "px";
        }
    })


    switchSlide(index)
    updateGraph(income, expense);
    updateUI();
    printTransactionHistory(account)
});
