const zlib = require('zlib')

function compress(data, contentType) {
    if (contentType.match(/\bdeflate\b/)) {
        return zlib.deflateSync(data)
    } else if (contentType.match(/\bgzip\b/)) {
        return zlib.gzipSync(data)
    } else if (contentType.match(/\bbr\b/)) {
        return zlib.brotliCompressSync(data)
    } else {
        return data
    }
}

function uncompress(data, contentType) {
    if (contentType.match(/\bdeflate\b/)) {
        return zlib.inflateSync(data)
    } else if (contentType.match(/\bgzip\b/)) {
        return zlib.unzipSync(data)
    } else if (contentType.match(/\bbr\b/)) {
        return zlib.brotliDecompressSync(data)
    } else {
        return data
    }
}

var isPrivate = function (ip) {
    return /^10\.|^192\.168\.|^172\.16\.|^172\.17\.|^172\.18\.|^172\.19\.|^172\.20\.|^172\.21\.|^172\.22\.|^172\.23\.|^172\.24\.|^172\.25\.|^172\.26\.|^172\.27\.|^172\.28\.|^172\.29\.|^172\.30\.|^172\.31\./.test(ip)
}

var randomByte = function () {
    return Math.round(Math.random() * 254)
}

var randomIp = function () {
    var ip = randomByte() + '.' +
        randomByte() + '.' +
        randomByte() + '.' +
        randomByte()
    if (isPrivate(ip)) return randomIp()
    return ip
}

var randomInt = function (maximum, minimum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

module.exports = { compress, uncompress, randomInt, randomIp }