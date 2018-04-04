var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Wallet = new Schema({
    type: { type: String, index: true},
    address: { type: String, unique: true, index: true },
    secret: { type: String, unique: true, index: true },
    balance: String,
});

Wallet.set('autoIndex', true);
const connection = mongoose.createConnection(__Config.MONGO);
var DBModel = connection.model('Wallet', Wallet);

exports = module.exports = {
    insert: async function (type, address, secret, balance = "0") {
        
    },

    get: async function (address) {
       
    },

    list: async function (from = 0, limit = 10, sort = "address") {
        
    }
}

