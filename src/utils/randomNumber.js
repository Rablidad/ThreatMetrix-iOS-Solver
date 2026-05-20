const crypto = require('crypto')

module.exports = (value) => {
    const randomBytes = crypto.randomBytes(value)
    return parseInt(randomBytes.toString('hex'), 16)
}
