var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Wallet = new Schema({
    type: { type: String, index: true},
    address: { type: String, unique: true, index: true },
    private: { type: String, unique: true, index: true },
    balance: String,
    createAt: Date,
});

Wallet.set('autoIndex', true);
const connection = mongoose.createConnection(__Config.MONGO);
var DBModel = connection.model('Wallet', Wallet);

exports = module.exports = {
    insert: async function (type, address, private, balance = "0") {
        try {
            if (!type || !address || !private) return null;
            let obj = await DBModel.findOne({ address })
            if (obj) return null;
            let newDoc = new DBModel({
                type: type,
                address: address,
                private: private,
                balance: balance,
                createAt: new Date()
            })
            await newDoc.save()
            return newDoc;
        } catch(err){
            console.log(err)
        }
        return null
        
    },

    get: async function (type, address) {
        var query = { address: address}
        if (type) query.type = type
        return await DBModel.findOne(query).exec()
    }
}

