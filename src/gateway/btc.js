//scan deposit
require('../scanDeposit/btc')

const bitcoinjs = require('bitcoinjs-lib')
const Common = require("../libs/common")
const Client = require("bitcoin-core")
const bs58check = require('bs58check')
const WalletDB = require("../models/adapter").Wallet
const DepositDB = require("../models/adapter").Deposit
var BigNumber = require('bignumber.js');


const rpc = Common.parseRpcUrl(__Config.BTC_RPC)
const client = new Client({ host: rpc.host, port: rpc.port, username: rpc.username, password: rpc.password })

exports = module.exports = {
    createWallet: createWallet,
    getWallet: getWallet,
    transferBalance: transferBalance,
    checkBalance: checkBalance,
    checkDeposit: checkDeposit
}

async function createWallet() {

    function createPrivateKeyInWIF(network) {
        var network = bitcoinjs.networks[network]
        address = bitcoinjs.ECPair.makeRandom({ network: network })
        var WIF = address.toWIF()

        return { address: address.getAddress(), WIF: WIF, private: bs58check.decode(WIF).toString("hex")}
    }

    try {
        var { address, WIF, private } = await createPrivateKeyInWIF(__Config.BTC_NETWORK)
        console.log("--------------------------------------------------" + WIF + "WIF");

        let result = await client.importPrivKey(WIF, 'autonomous')

        await WalletDB.insert("btc", address, Common.encryptData(WIF))
        return address
    } catch(err){
        console.log(err)
    }

    return null
}


async function getWallet(address) {
    return await WalletDB.get("btc", address)
}

async function transferBalance(from, outputs, fee) {

     async function findUtxoForTransfer(address, value) {
            var utxo = await client.listUnspent(2, null, [address])
            let sum = 0;
            let result = []
            for (var i in utxo) {
                sum += utxo[i].amount
                result.push(utxo[i])
                if (sum >= value) break;
            }
            if (sum < value) return null;
            return result
        }

    try {
        //get private key
        const fromWallet = await WalletDB.get("btc", from)
        const fromPrivateKey = Common.decryptData(fromWallet.private)

        //get total output value
        var outTotal = new BigNumber(fee);
        for (var i in outputs){
            outTotal = safeMaths(outTotal,'+',outputs[i]);

        }


        //get unspent
        var utxo = await findUtxoForTransfer(from, outTotal)
        if (!utxo) {
            console.log("Insufficent Balance")
            throw new Error("Insufficent Balance")
        }

        //construct inputs from unspent
        var inTotal =  new BigNumber(0);
        const inputs = utxo.map((x) => {
            inTotal = safeMaths(inTotal,'+',x.amount  );

            return {
                txid: x.txid,
                vout: x.vout
            }
        })

        //return change to send address
        var minUTXO = 0 //TODO: what if return change is so small, not worth to send back (using min value ???)

        if (inTotal > (outTotal + minUTXO ))  {
            outputs[from] = safeMaths((outputs[from] || 0), '+' ,(safeMaths(inTotal,'-',outTotal)))
        }

        var rawTx = await client.createRawTransaction(inputs, outputs)

        var signTx = await client.signRawTransaction(rawTx, null, [fromPrivateKey])
        return await client.sendRawTransaction(signTx.hex, false)

    } catch(err){
        console.log(err)
    }
    return null

}

async function checkBalance(address, confirm = 2) {
    var utxo = await client.listUnspent(confirm, null, [address])
    let sum = 0;
    for (var i in utxo) {
        //sum += utxo[i].amount
        sum = safeMaths(sum,'+',utxo[i].amount   );

    }
    return sum
}

async function checkDeposit(address){
    return await DepositDB.getByAddress(address)
}



var safeMaths = function(first, operation, sec) {

    var a = new BigNumber(first);
    var b = new BigNumber(sec);

    // Figure out which operation to perform.
    var operator;
    switch(operation.toLowerCase()) {
        case '-':
            operator = function(a,b) { return a.minus(b); };
            break;
        case '+':
            operator = function(a,b) { return a.plus(b); };
            break;
        case '*':
        case 'x':

            operator = function(a,b) { return a.times(b); };
            break;
        case '÷':
        case '/':

            operator = function(a,b) { return a.div(b); };
            break;
        case '^':
            operator  = function(a,b){ return a.pow(b);};
            break;

        // Let us pass in a function to perform other operations.
        default:
            operator = operation;
    }

    var result = operator(a,b);

    return result.toString();
};
