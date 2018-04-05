var bitcoinjs = require('bitcoinjs-lib')
const Client = require("bitcoin-core")
var bs58check = require('bs58check')

async function start(){
    const client = await new Client({ host: "173.212.209.107", port: 18443, username: "test", password: "pass" })
    // console.log(await client.listAccounts())
    // console.log(await client.importPrivKey(createPrivateKey(),'third'))
    // console.log(await client.listAccounts())
    // console.log(await client.getAddressesByAccount("third"))
    console.log(await client.getBalance())


}
start()

function createPrivateKey(){
    //create random address
    var address = bitcoinjs.ECPair.makeRandom()

    // deterministic RNG for testing only
    function rng() { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }
    address = bitcoinjs.ECPair.makeRandom()

    //using other network
    var testnet = bitcoinjs.networks.testnet
    var litecoin = bitcoinjs.networks.litecoin

    address = bitcoinjs.ECPair.makeRandom({network: testnet})

    //get wallet info format
    var WIF = address.toWIF()
    console.log(WIF)
    console.log(address.getAddress())
    return WIF
}


