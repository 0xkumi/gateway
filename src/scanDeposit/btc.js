/**
 * Scan deposit from bitcoin network.
 * Flow: list unspent output transaction, then check their confirmation. If confirmation < 2 -> unconfirm, else >= 2-> confirm (notify)
 */

const WalletDB = require("../models/adapter").Wallet
const Common = require("../libs/common")
const DepositDB = require("../models/adapter").Deposit
const Client = require("bitcoin-core")

const rpc = Common.parseRpcUrl(__Config.BTC_RPC)
const client = new Client({ host: rpc.host, port: rpc.port, username: rpc.username, password: rpc.password })

var MIN_CONFIRM = 1
var MAX_CONFIRM = 144 // ~1 day

async function scan() {
    
    var utxos = await client.listUnspent(MIN_CONFIRM, MAX_CONFIRM)
    
    for (var i  in utxos){
        let unspent = utxos[i]
        let address = unspent.address
        let vout = unspent.vout
        let amount = unspent.amount
        let confirmations = unspent.confirmations
        let txid = unspent.txid

        let query = {txid, address, vout}
        let data = {txid, address, vout, amount, confirmations} 
        let result = await DepositDB.update(query, data, true)
        console.log(result)

        //TODO: notify thrid party



    }

    //after the first run, reduce MAX_CONFIRM => reduce database load
    MAX_CONFIRM = 10

    setTimeout(scan,1000)
}

scan()