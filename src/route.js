const Common = require("./libs/common")

const cryptoGatewayPath = {
    "eth" : __dirname + "/crypto/eth"
}

function getGateWay(url){
    var regex = /\/coin\/([^\/]+)\//
    var match = regex.exec(url)
    if (match) return cryptoGatewayPath[match[1]]
}

exports = module.exports = function (app, router) {

    app.use("/", router);

    router.get("/coin/eth/wallet/create", createWallet);
    router.get("/coin/eth/wallet/list", listWallet);
    // router.get("/coin/eth/wallet/activity", WalletActivity);
    // router.get("/coin/eth/wallet/get", getWallet);
    // router.get("/coin/eth/balance/check", checkBalance);
    // router.get("/coin/eth/balance/transfer", transferBalance);
    // router.get("/coin/eth/transaction/fee", estimateFee);
    // router.get("/coin/eth/transaction/get", getTransaction);

    async function createWallet(req, res){
        try {
            const gatewayPath = getGateWay(req.url)
            //if cannot get support crypto
            if (!gatewayPath) return res.json(Common.createJsonReply(-1, "Cannot find support crypto"))
            const gateway = require(gatewayPath)
            const data = await gateway.createWallet()
            return res.json(Common.createJsonReply(0, data))
        } catch(err){
            console.log(err)
            return res.json(Common.createJsonReply(-1, "Internal Service Error"))
        }
    }
    
    async function listWallet(req, res) {
        try {
            const gatewayPath = getGateWay(req.url)
            //if cannot get support crypto
            if (!gatewayPath) return res.json(Common.createJsonReply(-1, "Cannot find support crypto"))
            const gateway = require(gatewayPath)
            const data = await gateway.listWallet()
            return res.json(Common.createJsonReply(0, data))
        } catch (err) {
            console.log(err)
            return res.json(Common.createJsonReply(-1, "Internal Service Error"))
        }
    }
}
