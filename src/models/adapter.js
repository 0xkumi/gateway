var Wallet
var Deposit

switch (__Config.DB) {
    case "MONGO":
        console.log("Use mongo database ...")
        Wallet = require("./mongo/wallet")
        Deposit = require("./mongo/deposit")
        break;
    case "FIRESTORE":
        console.log("Use firestore database ...")
    default:
        Wallet = require("./firebase/wallet")
        Deposit = require("./mongo/deposit")
}

module.exports = {
    Wallet: Wallet,
    Deposit: Deposit
}
