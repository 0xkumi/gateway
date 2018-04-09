const Web3 = require('web3')
const Common = require("../libs/common")
var rpc_server = __Config.ETH_RPC
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))
var WalletDB = require("../models/adapter").Wallet

exports = module.exports = {
    createWallet: createWallet,
    getWallet: getWallet,
    transferBalance: transferBalance,
    checkBalance: checkBalance
}

async function createWallet() {
    var newAccount = await web3.eth.accounts.create()
    await WalletDB.insert("eth", newAccount.address, Common.encryptData(newAccount.privateKey))
    return newAccount.address
}

async function getWallet(address) {
    return await WalletDB.get("eth", address)
}

async function transferBalance(from, to, value) {

    // var rawTx = {
    //     gas: 21000, 
    //     gasPrice: ,
    //     to: to,
    //     value: web3.utils.toWei(value, 'ether'),
    //     nonce: await web3.eth.getTransactionCount(newAccount.address), //TODO: 
    //     chainId: await web3.shh.net.getId()
    // }

    // console.log(rawTx)


    // const sign = await  newAccount.signTransaction(rawTx)
    // var sign = await web3.eth.accounts.signTransaction(rawTx, newAccount.privateKey)

    // web3.eth.sendSignedTransaction(sign.rawTransaction)
    // .on('receipt', function(receipt){
    //     getBalance(newAccount.address)
    // })
}

async function checkBalance(addr) {
    return await web3.eth.getBalance(addr);
}

