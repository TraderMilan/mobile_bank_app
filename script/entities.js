export class Account {
    constructor(balance = 0, transitionHistory = [], accountNumber = null) {
        this.accountNumber = accountNumber || Math.floor(Math.random() * 999999999) + 100000000;
        this.balance = balance;
        this.transitionHistory = transitionHistory.map(t => new Transaction(t.type, t.amount, new Date(t.date)));
    }

    addTransition(transition) {
        this.transitionHistory.push(transition);
    }

    exportData() {
        return {
            accountNumber: this.accountNumber,
            balance: this.balance,
            transitionHistory: this.transitionHistory.map(t => t.exportData())
        };
    }
}

export class Client {
    constructor(name, account = null) {
        this.name = name;
        this.account = account instanceof Account ? account : new Account();
    }

    depositMoney(amount) {
        this.account.balance += amount;
        this.account.addTransition(new Transaction("income", amount));
    }

    withdrawMoney(amount) {
        if (this.account.balance < amount) return false;
        this.account.balance -= amount;
        this.account.addTransition(new Transaction("expanse", amount));
        return true;
    }

    exportData() {
        return {
            name: this.name,
            account: this.account.exportData()
        };
    }
}

export class Transaction {
    constructor(type, amount, date = new Date()) {
        this.type = type;
        this.amount = amount;
        this.date = new Date(date);
    }

    exportData() {
        return {
            type: this.type,
            amount: this.amount,
            date: this.date.toISOString()
        };
    }

    getInfo() {
        return `${this.type} - ${this.amount}€ - ${this.date.toLocaleString()}`;
    }
}
