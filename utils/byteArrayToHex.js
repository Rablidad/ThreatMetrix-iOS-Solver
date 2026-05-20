module.exports = (byteArray) => {
    var buffer = Buffer.from(byteArray)
    var hexString = buffer.toString('hex')
    return hexString
}