module.exports = (hexString) => {
    hexString = hexString.replace(/\s/g, '')
    var buffer = Buffer.from(hexString, 'hex')
    var byteArray = Array.from(buffer)
    return byteArray
}