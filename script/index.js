import { Account, Transaction, Client} from "./script/entities.js";

let client1 = new Client("Domin")
let client2 = new Client("Marek")

let account1_1 = client1.createAccount()
let account1_2 = client1.createAccount()

let account2_1 = client2.createAccount()
let account2_2 = client2.createAccount()

client1.depositMoney(account1_1, 500)
client1.withdrawMoney(account1_1, 100)
client1.transferMoney(account1_2, account1_1, 200)

client1.getTransactionHistory(account1_1)

