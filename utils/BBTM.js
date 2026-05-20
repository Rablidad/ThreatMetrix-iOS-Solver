const randBigInt = require('./randBigInt.js')

module.exports = function (seed) {
    var rand = BigInt.asIntN(64, randBigInt())
    rand &= ~0x100000n
    rand = rand - (rand | 0xFFFFFDFFFFFFFFFFn) - 0x20000000001n
    var v9 = seed % 0x14 + 21 * (seed % 3)
    rand |= BigInt(1) << BigInt(v9)
    return rand
}