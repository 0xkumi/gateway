require("../config")

if (__Config.NODE_ENV!="development") {
    console.log("This test is only for development mode")
    process.exit(-1)
}

var assert = require('assert');
var Client = require("bitcoin-core")
var exec = require("child_process").exec
const Common = require("../src/libs/common")
var rpc = Common.parseRpcUrl(__Config.BTC_RPC)
var client = new Client({ host: rpc.host, port: rpc.port, username: rpc.username, password: rpc.password })

var METHOD_URL = {
    createWallet: `http://localhost:${__Config.SERVER_PORT}/coin/btc/wallet/create`,
    getWallet: `http://localhost:${__Config.SERVER_PORT}/coin/btc/wallet/get`,
    transferBalance: `http://localhost:${__Config.SERVER_PORT}/coin/btc/balance/transfer`,
    checkBalance: `http://localhost:${__Config.SERVER_PORT}/coin/btc/balance/check`,
    checkDeposit: `http://localhost:${__Config.SERVER_PORT}/coin/btc/deposit/check`,
}

async function sendHttp(method, data) {
    const querystring = require("querystring")
    return new Promise(function (resolve) {
        var cmd = `curl -sf "${METHOD_URL[method]}"`
        if (data) cmd = `curl -sf -H "Content-Type: application/json" "${METHOD_URL[method]}" --data '${JSON.stringify(data)}'`
        exec(cmd, function (err, stdout) {
            if (err) console.log(err)
            resolve(stdout || "")
        })
    })
}

async function timeout(s) {
    return new Promise(function (resolve) {
        setTimeout(resolve, s)
    })
}


describe('CryptoGateway BTC', function () {
    let rootAccount, account1

    describe("At the beginning", function () {
        it("should return wallet when call createWallet", async () => {
            let result = JSON.parse(await sendHttp("createWallet"))
            if (result.status != "ok") console.log(result)
            assert(result.status == "ok" && result.data)
            rootAccount = result.data
            await client.generateToAddress(100, rootAccount)
            // make previous generating block mature (able to use)
            await client.generate(200)
        })

        it("should return wallets when call getWallet", async () => {
            let result = JSON.parse(await sendHttp("getWallet", {address: rootAccount}))
            if (result.status != "ok") console.log(result)
            assert(result.status == "ok" && result.data && result.data.address)
        })
    })

    describe("When running", function () {

        it("should see deposit transaction if any", async () => {
            account1 = JSON.parse(await sendHttp("createWallet")).data;

            //construct outputs
            var outputs = {}
            outputs[account1] = 1

            let transferResult = await sendHttp("transferBalance", { from: rootAccount, outputs: outputs, fee: 0.0005 })

            //wait for 4 block mined
            await client.generate(4)
            await timeout(2000)

            //check deposit
            let despositResult = JSON.parse(await sendHttp("checkDeposit", { address: account1 })).data
            assert(despositResult.length==1)
            assert(despositResult[0].address==account1)
            assert(despositResult[0].amount==1)
            assert(despositResult[0].confirmations==4)

        })

        it("should be able to transfer balance", async () => {
            account1 = JSON.parse(await sendHttp("createWallet")).data;
            let rootBalanceBefore = JSON.parse(await sendHttp("checkBalance", { address: rootAccount })).data
            console.log("******************************rootBalanceBefore"+rootBalanceBefore)
            //construct outputs
            var outputs = {}
            outputs[account1] = 1

            let transferResult = await sendHttp("transferBalance", { from: rootAccount, outputs: outputs, fee: 0.0005 })
            //wait for 2 confirmations
            await client.generate(2)

            //check updated balance
            let accountBalance = JSON.parse(await sendHttp("checkBalance", { address: account1 })).data
            let rootBalanceAfter = JSON.parse(await sendHttp("checkBalance", { address: rootAccount })).data

            console.log("******************************rootBalanceAfter"+rootBalanceAfter)
            console.log("******************************rootBalanceBefore"+(rootBalanceBefore - 1.0005))

            //assert(accountBalance == 1)
            assert(rootBalanceAfter == rootBalanceBefore - 1.0005)
        })

    })
});
