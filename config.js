var Config = {
    NODE_ENV: process.env["NODE_ENV"],
    SERVER_PORT: process.env["SERVER_PORT"],
    ETH_RPC: process.env["ETH_RPC"],
    BTC_RPC: process.env["BTC_RPC"],
    BTC_NETWORK: process.env["BTC_NETWORK"],
    MONGO: process.env["MONGO"],
    SECRET: process.env["SECRET"],
    DB: process.env["DB"],
    //Number of confirmation before consider transaction is valid 
    ETH_VALID_CONFIRM: 30
}

Object.defineProperty(global, '__Config', {
    get: function () {
        return Config;
    }
});

exports = module.exports = Config
