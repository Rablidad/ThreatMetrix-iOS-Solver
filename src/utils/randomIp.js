var isPrivate = function (ip) {
    return /^10\.|^192\.168\.|^172\.16\.|^172\.17\.|^172\.18\.|^172\.19\.|^172\.20\.|^172\.21\.|^172\.22\.|^172\.23\.|^172\.24\.|^172\.25\.|^172\.26\.|^172\.27\.|^172\.28\.|^172\.29\.|^172\.30\.|^172\.31\./.test(ip)
}

var randomByte = function () {
    return Math.round(Math.random() * 254)
}

var v4 = function () {
    var ip = randomByte() + '.' +
        randomByte() + '.' +
        randomByte() + '.' +
        randomByte()
    if (isPrivate(ip)) return v4()
    return ip
}

var v6 = function () {
    const prefixes = [
        { prefix: '2804:', blocks: 7 },
        { prefix: 'fe80::', blocks: 4 },
        { prefix: '0:0:fe80::', blocks: 2 },
        { prefix: '::2804:', blocks: 6 }
    ]
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    let ipAddress = randomPrefix.prefix
    for (let i = 0; i < randomPrefix.blocks; i++) {
        const block = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
        ipAddress += (i > 0 ? ':' : '') + block
    }

    return ipAddress
}

module.exports = { v4, v6 }