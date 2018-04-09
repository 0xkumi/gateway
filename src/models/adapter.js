module.exports = {
    Wallet: function(){
        switch (__Config.DB) {
            case "MONGO":
                console.log("Use mongo database ...")
                return require("./mongo/wallet")
            case "FIRESTORE":
                console.log("Use firestore database ...")
            default:
                return require("./firebase/wallet")
        }
    }
}

/**
 * Wallet
 * createWallet
 * getWallet
 * getBalance
 * <listWallet>
*/
