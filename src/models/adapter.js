module.exports = {
    Wallet: function(){
        switch (__Config.DB) {
            case "MONGO":
                return require("./mongo/wallet")
            case "FIRESTORE":
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
