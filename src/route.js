const Common = require("./libs/common")

const cryptoGatewayPath = {
    "eth": __dirname + "/gateway/eth",
    "btc": __dirname + "/gateway/btc"
}

function getGateWay(url){
    var regex = /\/coin\/([^\/]+)\//
    var match = regex.exec(url)
    if (match) return { type: match[1], path: cryptoGatewayPath[match[1]]}
}

exports = module.exports = function (app, router) {

    app.use("/", router);

    router.get("/coin/eth/wallet/create", createWallet);
    router.post("/coin/eth/wallet/get", getWallet);
    // router.get("/coin/eth/wallet/activity", WalletActivity);
    // router.get("/coin/eth/wallet/get", getWallet);
    // router.get("/coin/eth/balance/check", checkBalance);
    // router.get("/coin/eth/balance/transfer", transferBalance);
    // router.get("/coin/eth/transaction/fee", estimateFee);
    // router.get("/coin/eth/transaction/get", getTransaction);

    router.get("/coin/btc/wallet/create", createWallet);
    router.post("/coin/btc/wallet/get", getWallet);
    router.post("/coin/btc/wallet/checkBalance", checkBalance);
    router.post("/coin/btc/balance/transfer", transferBalance);

    router.all("/*", function(req, res){
        console.log(req.body)
    })
    
    async function createWallet(req, res){
        try {
            const {type, path} = getGateWay(req.url)
            //if cannot get support crypto
            if (!path) return res.json(Common.createJsonReply(-1, "Cannot find support crypto"))
            const gateway = require(path)
            const data = await gateway.createWallet()
            return res.json(Common.createJsonReply(0, data))
        } catch(err){
            console.log(err)
            return res.json(Common.createJsonReply(-1, "Internal Service Error"))
        }
    }
    
    async function getWallet(req, res) {
        try {
            const { type, path } = getGateWay(req.url)
            //if cannot get support crypto
            if (!path) return res.json(Common.createJsonReply(-1, "Cannot find support crypto"))
            const gateway = require(path)
            const data = await gateway.getWallet(req.body.address)
            return res.json(Common.createJsonReply(0, data))
        } catch (err) {
            console.log(err)
            return res.json(Common.createJsonReply(-1, "Internal Service Error"))
        }
    }

    async function checkBalance(req, res) {
        try {
            const { type, path } = getGateWay(req.url)
            //if cannot get support crypto
            if (!path) return res.json(Common.createJsonReply(-1, "Cannot find support crypto"))
            const gateway = require(path)
            const data = await gateway.checkBalance(req.body.address)
            return res.json(Common.createJsonReply(0, data))
        } catch (err) {
            console.log(err)
            return res.json(Common.createJsonReply(-1, "Internal Service Error"))
        }
    }

    async function transferBalance(req, res) {
        try {
            const { type, path } = getGateWay(req.url)
            //if cannot get support crypto
            if (!path) return res.json(Common.createJsonReply(-1, "Cannot find support crypto"))
            const gateway = require(path)
            
            const data = await gateway.transferBalance(req.body.from, req.body.outputs, req.body.fee)
            return res.json(Common.createJsonReply(0, data))
        } catch (err) {
            console.log(err)
            return res.json(Common.createJsonReply(-1, "Internal Service Error"))
        }
    }
}
