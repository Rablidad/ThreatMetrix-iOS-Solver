const randBigInt = require('./randBigInt.js')

module.exports = function (seed) {
    var rand = BigInt.asIntN(64, randBigInt())
    rand &= ~0x100000n;
    rand &= ~0x20000000000n;
    var v7 = seed % 0x14 + 21 * (seed % 3)
    rand |= BigInt(1) << BigInt(v7)
    return rand
}