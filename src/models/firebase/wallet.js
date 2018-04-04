var admin = require("firebase-admin");
var serviceAccount = require("../../../resources/.firestore.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://staging-crypto-exchange.firebaseio.com"
});
var db = admin.firestore();
var Wallet = db.collection('wallets')

// Wallet:
//     type: String,
//     address: String,
//     secret: String,
//     balance: String

exports = module.exports = {
    insert: async function (type, address, secret, balance = "0") {
        if (!type || !address || !secret) return null;
        let obj = await exports.get("123")
        if (obj) return null;
        console.log(address, obj)
        let newDoc = Wallet.doc(address)
        let data = {
            type: type,
            address: address,
            secret: secret,
            balance: balance
        }
        let newData = await newDoc.set(data)
        return data;
    },
    get: async function (address) {
        if (!address) return null;
        var obj = await Wallet.doc(address).get();
        if (obj.exists) return obj.data()
        else return null
    },
};


