module.exports = {
    Wallet: function(){
        switch (__Config.DATABASE) {
            case "mongo":
                return require("./mongo/wallet")
            default:
                return require("./firebase/wallet")
        }
    }
}