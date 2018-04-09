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
//     createAt: Date

exports = module.exports = {
    insert: async function (type, address, secret, balance = "0") {
        if (!type || !address || !secret) return null;
        let obj = await exports.get(address)
        if (obj) return null;
        let newDoc = Wallet.doc(address)
        let data = {
            type: type,
            address: address,
            secret: secret,
            balance: balance,
            createAt: new Date()
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

    list: async function(from = 0, limit = 10, sort = "address"){
        let requestCollection = Wallet.get()
        let requestList = Wallet.orderBy(sort).limit(limit).startAt(from).get()
        return Promise.all([requestCollection, requestList], function (err, results) {
            
            return {
                // total: results[0].size,
                wallets: results[1].docs.map((x) => {
                    return x.data()
                })
            }
        })
        
    }
};

