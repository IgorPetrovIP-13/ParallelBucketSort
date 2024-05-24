export default class BankClient {
    #accountBalance;

    constructor(initialBalance) {
        this.#accountBalance = initialBalance;
    }

    getBalance() {
        return this.#accountBalance;
    }
}