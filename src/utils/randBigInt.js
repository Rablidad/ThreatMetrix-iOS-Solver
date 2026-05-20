const crypto = require('crypto')

module.exports = function () {
    const randomBytes = crypto.randomBytes(8)
    return BigInt(`0x${randomBytes.toString('hex')}`)
}