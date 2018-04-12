var bitcoinjs = require('bitcoinjs-lib')
const Client = require("bitcoin-core")
var bs58check = require('bs58check')
var client
//'' : mmvhm8KssEvxErP8FRCvUJHUnQWRVCoiaL
//'four':  mmh2moWwkYdQN7ka9BZmD3ufmm8aFfs7d9 cNQB3968JmURv41YVcMbfBP9Wk4HT5V3qmuX8vVSZjyAvABPK6Fd ef186be8246dc0afe86a583acc0992ee81f9e79f359470724518e0416aeae5acbd01

// curl--data - binary '{"jsonrpc":"2.0","id":"curltext","method":"getdifficulty","params":[]}' - H 'content-type:text/plain;' http://bitcoin:local321@127.0.0.1:8332/

//transaction: 50c66704d5254267de673027f256aa09a1cbe521c10d4d70925060fb2b8ec99c
async function start(){
    client = await new Client({ host: "192.168.1.113", port: 8332, username: "autonomous", password: "autonomous123" })

    // console.log(await client.generateToAddress(1, "mq723bSt7PEBvaf7oe35Ss6FvgrkHSYBFR"))

    //await client.generate(1)

    //var utxo = await client.listUnspent(1, null)
    //console.log(utxo)
    // utxo.map(function(x){
    //     console.log(x.confirmations, x.amount)
    // })
    // console.log(await client.listTransactions("tester6"))
    // console.log(await client.getTransaction("f347f255456e3166095740de1f21c2e1523a86e4aacdb3b55052c404f0049d1a"))
     console.log(await client.importPrivKey(createPrivateKeyInWIF(),'tester6'))

    // console.log(await client.getAddressesByAccount("tester1"))
     console.log(await client.listAccounts())

    // estimateFee("mmvhm8KssEvxErP8FRCvUJHUnQWRVCoiaL", { "mmh2moWwkYdQN7ka9BZmD3ufmm8aFfs7d9": 1, "mmvhm8KssEvxErP8FRCvUJHUnQWRVCoiaL": 48.9999})
}
start()

function createPrivateKeyInWIF(network = "testnet"){
    console.log(network)
    var network = bitcoinjs.networks[network]
    address = bitcoinjs.ECPair.makeRandom({network: network})
    var WIF = address.toWIF()
    console.log(address.getAddress(), WIF, bs58check.decode(WIF).toString("hex"))
    return WIF
}

//rootAddress: in case value is greater than fromAddress balance, using rootAddress to transfer
async function sendFrom(fromAddress, toAddressArr, value, txFee) {
    var utxo = await client.listUnspent(1, null, [fromAddress])
    var balance = await addressBalance(fromAddress)
    if (balance < value + fee) {
        console.log("Insufficent Balance")
        throw new Error("Insufficent Balance")
    }

}

//fee=in*180+out*34+10 +- in
async function estimateFee(fromAddress, toObj, privateKey){
    var sendTotal = 0;
    for (var k in toObj){
        sendTotal += toObj[k]
    }
    console.log(fromAddress, sendTotal)
    var utxo = await findUtxoForTransfer(fromAddress, sendTotal)
    if (!utxo) {
        console.log("Insufficent Balance")
        throw new Error("Insufficent Balance")
    }

    const vin = utxo.map((x)=>{
        return {
            txid: x.txid,
            vout: x.vout
        }
    })
    console.log(vin, toObj)
    var rawTx = await client.createRawTransaction(vin, toObj)
    console.log(rawTx)
    var signTx = await client.signRawTransaction(rawTx, null, privateKey ? [privateKey] : null)
    console.log(signTx)
    console.log(await client.sendRawTransaction(signTx.hex, false))
}

async function findUtxoForTransfer(address, value){
    var utxo = await client.listUnspent(1, null, [address])
    let sum = 0;
    let result = []
    for (var i in utxo){
        sum += utxo[i].amount
        result.push(utxo[i])
        if (sum >= value) break;
    }
    if (sum < value) return null;
    return result
}
