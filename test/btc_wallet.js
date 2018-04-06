var bitcoinjs = require('bitcoinjs-lib')
const Client = require("bitcoin-core")
var bs58check = require('bs58check')
var client 
//'' : mmvhm8KssEvxErP8FRCvUJHUnQWRVCoiaL
//'four':  mmh2moWwkYdQN7ka9BZmD3ufmm8aFfs7d9 cNQB3968JmURv41YVcMbfBP9Wk4HT5V3qmuX8vVSZjyAvABPK6Fd ef186be8246dc0afe86a583acc0992ee81f9e79f359470724518e0416aeae5acbd01
async function start(){
    client = await new Client({ host: "173.212.209.107", port: 18443, username: "test", password: "pass" })
    // console.log(await client.listAccounts())
    // console.log(await client.importPrivKey(createPrivateKeyInWIF(),'four'))
    // console.log(await client.listAccounts())
    // console.log(await client.getAddressesByAccount("third"))
    sendFrom("mmvhm8KssEvxErP8FRCvUJHUnQWRVCoiaL", "mmh2moWwkYdQN7ka9BZmD3ufmm8aFfs7d9", 1, false)
}
start()

function createPrivateKeyInWIF(network = "testnet"){
    var network = bitcoinjs.networks[network]
    address = bitcoinjs.ECPair.makeRandom({network: network})
    var WIF = address.toWIF()
    // console.log(address.getAddress(), WIF, bs58check.decode(WIF).toString("hex"))
    return WIF
}

//rootAddress: in case value is greater than fromAddress balance, using rootAddress to transfer
async function sendFrom(fromAddress, toAddress, value, feeType, rootAddress) {
    var utxo = await client.listUnspent(1, null, [fromAddress])
    var balance = await addressBalance(fromAddress)

    if (balance < value) {
        if (!rootAddress) {
            console.log("Insufficent Balance")
            throw new Error("Insufficent Balance")
        }
        var root_utxo = await client.listUnspent(1, null, [rootAddress])
        utxo = root_utxo ? utxo.concat(root_utxo) : utxo
    }
    


    console.log(utxo)
    
}

function constructTransaction(vin, vout){

}

async function addressBalance(address){
    var utxo = await client.listUnspent(1, null, [address])
    let sum = 0;
    for (var i in utxo){
        sum += utxo[i].amount
    }
    return sum
}