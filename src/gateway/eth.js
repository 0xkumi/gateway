const Web3 = require('web3')
const Common = require("../libs/common")
var rpc_server = __Config.ETH_RPC
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))
var WalletDB = require("../models/adapter").Wallet()

exports = module.exports = {
    createWallet: createWallet,
    listWallet: listWallet,
    getWallet: getWallet,
    transferBalance: transferBalance,
    checkBalance: checkBalance
}

async function createWallet() {
    var newAccount = await web3.eth.accounts.create()
    let newWallet = await WalletDB.insert("eth", newAccount.address, Common.encryptData(newAccount.privateKey))
    var {address, balance} = newWallet
    return { address, balance }
}

async function listWallet(from = 0, size = 10) {
    return new Promise(function (resolve) {
        WalletDB.count().exec(function (err, total){
            if (err) {
                console.log(err)
                return reject(new Error("Cannot access to database"))
            }
            WalletDB.find({}).skip(from).limit(size).lean().exec(function (err, data) {
                if (err) {
                    console.log(err)
                    return reject(new Error("Cannot access to database"))
                }
                resolve({wallets: data, total: total})
            })
        })
    })
}

async function getWallet(address) {
    return new Promise(function (resolve) {
        WalletDB.findOne({address: address}).exec(function (err, data) {
            if (err) {
                console.log(err)
                return reject(new Error("Cannot access to database"))
            }
            resolve(data)
        })
    })
}

async function transferBalance(from, to, value) {
    
}

async function checkBalance(addr) {
    return await web3.eth.getBalance(addr);
}

