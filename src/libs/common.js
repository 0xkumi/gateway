const crypto = require("crypto")
module.exports = {
    createJsonReply(code, data){
        if (code!=0) {
            return { status: "error", code: code, msg: data }
        }
        return {status: "ok", data: data}
    },
    encryptData: function (str) {
        console.log(str, __Config.SECRET)
        var cipher = crypto.createCipher("aes-128-cbc", __Config.SECRET)
        var crypted = cipher.update(str, 'utf-8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decryptData: function (str) {
        var decipher = crypto.createDecipher("aes-128-cbc", __Config.SECRET)
        var dec = decipher.update(str, 'hex', 'utf-8')
        dec += decipher.final('utf-8');
        return dec;
    },
}