module.exports = (data, key) => {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, Buffer.alloc(16))
    let encrypted = cipher.update(data, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
}
