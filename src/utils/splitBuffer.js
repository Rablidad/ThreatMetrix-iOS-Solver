module.exports = (buffer) => {
    var pairBuffer = []
    var oddBuffer = []
    for (let i = 0; i < buffer.length; i++) {
        if (i % 2 !== 0) {
            pairBuffer.push(buffer[i])
        } else {
            oddBuffer.push(buffer[i])
        }
    }
    return { pairBuffer: Buffer.from(pairBuffer), oddBuffer: Buffer.from(oddBuffer) }
}