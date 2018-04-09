require("../config")
if (!__Config.NODE_ENV != "development") {
    console.log("This test is only for development mode")
    process.exit(-1)
}

var assert = require('assert');
var exec = require("child_process").exec
const Web3 = require('web3')
var rpc_server = __Config.ETH_RPC
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))

var METHOD_URL = {
    createWallet: `http://localhost:${__Config.SERVER_PORT}/coin/eth/wallet/create`,
    getWallet: `http://localhost:${__Config.SERVER_PORT}/coin/eth/wallet/get`,
    transferBalance: `http://localhost:${__Config.SERVER_PORT}/coin/eth/balance/transfer`,
}

async function sendHttp(method, data) {
    const querystring = require("querystring")
    return new Promise(function (resolve) {
        var cmd = `curl -sf "${METHOD_URL[method]}"`
        if (data) cmd = `curl -sf "${METHOD_URL[method]}" --data '${data}'`
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
describe('CryptoGateway ETH', function () {
    let account1
    
    describe("At the beginning", function () {
        it("should return wallet when call createWallet", async () => {
            let result = JSON.parse(await sendHttp("createWallet"))
            if (result.status != "ok") console.log(result)
            assert(result.status == "ok" && result.data)
            account1 = result.data
        })

        it("should return wallets when call getWallet", async () => {
            let result = JSON.parse(await sendHttp("getWallet", "address=" + account1))
            if (result.status != "ok") console.log(result)
            assert(result.status == "ok" && result.data && result.data.address)
        })
    })

    describe("When running", function () {

        // beforeEach("Create Account", async () => {
        //     account1 = JSON.parse(await sendGET("createAccount", {})).data;
        //     account2 = JSON.parse(await sendGET("createAccount", {})).data;
        //     account3 = JSON.parse(await sendGET("createAccount", {})).data;
        //     account4 = JSON.parse(await sendGET("createAccount", {})).data;
        //     account5 = JSON.parse(await sendGET("createAccount", {})).data;
        //     await web3.eth.sendTransaction({ to: account1.etherAddress, from: localAccounts[0], value: web3.utils.toWei('10', 'ether') })
        //     await web3.eth.sendTransaction({ to: account2.etherAddress, from: localAccounts[1], value: web3.utils.toWei('10', 'ether') })
        //     await web3.eth.sendTransaction({ to: account3.etherAddress, from: localAccounts[2], value: web3.utils.toWei('10', 'ether') })
        //     await web3.eth.sendTransaction({ to: account4.etherAddress, from: localAccounts[3], value: web3.utils.toWei('10', 'ether') })

        //     await simulateTransaction()
        //     await timeout(2000)
        // })

        // async function simulateTransaction() {
        //     for (let i = 0; i < 40; i++) {
        //         await web3.eth.sendTransaction({ to: account5.etherAddress, from: localAccounts[4], value: web3.utils.toWei('10', 'szabo') })
        //     }
        // }

    //     it("should update account balance when deposit ", async () => {
    //         let balance1 = JSON.parse(await sendGET("getAccount", { id: account1.id })).data.mether.balance;
    //         assert(balance1 == 10000000)

    //         //TODO: check database
    //     })

    //     it("should update account balance when transfer ", async () => {
    //         await sendGET("transferBalance", { from: account1.id, to: account2.id, value: 2e6 })
    //         let balance1 = JSON.parse(await sendGET("getAccount", { id: account1.id })).data.mether.balance;
    //         let balance2 = JSON.parse(await sendGET("getAccount", { id: account2.id })).data.mether.balance;
    //         assert(balance2 == 12000000)
    //         assert(balance1 == 8000000)
    //     })
    })






});