module.exports = {
    Wallet: (__Config.DATABASE == "firestore") ? require("./firestore/wallet") : require("./mongo/wallet")
    
}