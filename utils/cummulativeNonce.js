module.exports = (nonce) => {
    var cummulative = 0
    for (var i = 0; i < nonce.length; i++) {
        cummulative += nonce.charCodeAt(i)
    }
    return cummulative
}