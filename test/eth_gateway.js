require("../config")

var assert = require('assert');
var exec = require("child_process").exec
const Web3 = require('web3')
var rpc_server = __Config.ETH_RPC
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))

var METHOD_URL = {
    createWallet: `http://localhost:${__Config.SERVER_PORT}/coin/eth/wallet/create`,
    listWallet: `http://localhost:${__Config.SERVER_PORT}/coin/eth/wallet/list`,
    transferBalance: `http://localhost:${__Config.SERVER_PORT}/coin/eth/balance/transfer`,
}

async function sendGET(method, data) {
    const querystring = require("querystring")
    return new Promise(function (resolve) {
        exec(`curl -sf "${METHOD_URL[method]}"`, function (err, stdout) {
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
describe('CryptoGateway', function () {
    var localAccounts = []
    let account1, account2, account3, account4

    before("Get Account", async () => {
        localAccounts = await web3.eth.getAccounts();
        assert(localAccounts.length > 0);
    })

    describe("At the beginning", function () {
        it("should return wallet when call createWallet", async () => {
            assert(JSON.parse(await sendGET("createWallet")).status == "ok")
        })

        it("should return wallets when call listWallet", async () => {
            assert(JSON.parse(await sendGET("createWallet")).status == "ok")
            assert(JSON.parse(await sendGET("listWallet")).data.total == 2)
        })

    })

    describe("When running", function () {

        beforeEach("Create Account", async () => {
            account1 = JSON.parse(await sendGET("createAccount", {})).data;
            account2 = JSON.parse(await sendGET("createAccount", {})).data;
            account3 = JSON.parse(await sendGET("createAccount", {})).data;
            account4 = JSON.parse(await sendGET("createAccount", {})).data;
            account5 = JSON.parse(await sendGET("createAccount", {})).data;
            await web3.eth.sendTransaction({ to: account1.etherAddress, from: localAccounts[0], value: web3.utils.toWei('10', 'ether') })
            await web3.eth.sendTransaction({ to: account2.etherAddress, from: localAccounts[1], value: web3.utils.toWei('10', 'ether') })
            await web3.eth.sendTransaction({ to: account3.etherAddress, from: localAccounts[2], value: web3.utils.toWei('10', 'ether') })
            await web3.eth.sendTransaction({ to: account4.etherAddress, from: localAccounts[3], value: web3.utils.toWei('10', 'ether') })

            await simulateTransaction()
            await timeout(2000)
        })

        async function simulateTransaction() {
            for (let i = 0; i < 40; i++) {
                await web3.eth.sendTransaction({ to: account5.etherAddress, from: localAccounts[4], value: web3.utils.toWei('10', 'szabo') })
            }
        }

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