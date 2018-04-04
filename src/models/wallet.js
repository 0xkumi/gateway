var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Wallet = new Schema({
    type: { type: String, index: true},
    address: { type: String, unique: true, index: true },
    secret: { type: String, unique: true, index: true },
    balance: {type: String, default: 0},
});

Wallet.set('autoIndex', true);
const connection = mongoose.createConnection(__Config.MONGO);
var DBModel = connection.model('Wallet', Wallet);
exports = module.exports = DBModel

