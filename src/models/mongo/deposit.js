var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Deposit = new Schema({
    txid: { type: String, index: true},
    vout: { type: Number, index: true},
    address: { type: String, index: true },
    amount: { type: Number, index: true },
    confirmations: { type: Number, index: true }
});

Deposit.set('autoIndex', true);
Deposit.index({txid:1, vout: 1},{unique: true})

const connection = mongoose.createConnection(__Config.MONGO);
var DBModel = connection.model('Deposit', Deposit);

exports = module.exports = {
    insert: async function (txid, vout, address, amount, confirmations) {
        try {
            let newDoc = new DBModel({
                txid, vout, address, amount, confirmations
            })
            await newDoc.save()
            return newDoc;
        } catch(err){
            console.log(err)
        }
        return null
        
    },

    getByVout: async function (txid, vout) {
        return await DBModel.findOne({txid, vout}).exec()
    },

    getByAddress: async function(address){
        return await DBModel.find({address}).exec()
    },

    update: async function(query, data, upsert){
        let result = await DBModel.findOneAndUpdate(query, data, {upsert: upsert, new: true}).exec()
        return result
    },

    model: DBModel
}

