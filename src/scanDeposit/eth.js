/**
 * Scan deposit from bitcoin network.
 * Flow: find all transaction of previous block (limit MAX_CONFIRM). If confirmation < 30 -> unconfirm, else >= 30-> confirm (notify)
 */

const Common = require("../libs/common")
const DepositDB = require("../models/adapter").Deposit

async function scan() {
    
    

    setTimeout(scan,1000)
}

scan()