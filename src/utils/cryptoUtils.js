const crypto = require('crypto')

var generateKeyPair = () => {
    return new Promise(resolve => {
        crypto.generateKeyPair('rsa', { modulusLength: 2048 }, (_, publicKey, privateKey) => {
            const publicPEM = publicKey.export({
                type: 'pkcs1',
                format: 'pem',
            })
            const privatePEM = privateKey.export({
                type: 'pkcs1',
                format: 'pem',
            })
            resolve({
                publicKey: publicPEM,
                privateKey: privatePEM,
            })
        }
        )
    })
}

var encryptRSA = (data, publicKey) => {
    var encrypted = crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'utf8'))
    return encrypted.toString('base64')
}

var decryptRSA = (data, privateKey) => {
    var decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'base64'))
    return decrypted.toString('base64')
}

var encryptAES = (data, privateKey) => {
    var key = Buffer.from(privateKey, 'base64')
    var cipher = crypto.createCipheriv('aes-256-ecb', key, null)
    var encrypted = Buffer.concat([cipher.update(data), cipher.final()])
    return encrypted.toString('base64')
}

var decryptAES = (data, privateKey) => {
    var key = Buffer.from(privateKey, 'base64')
    var decipher = crypto.createDecipheriv('aes-256-ecb', key, null)
    var decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()])
    return decrypted.toString()
}

module.exports = { generateKeyPair, encryptRSA, decryptRSA, encryptAES, decryptAES }