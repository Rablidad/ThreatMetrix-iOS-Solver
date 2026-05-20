module.exports = length => {
    const alfabet = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
    return alfabet.repeat(20).split("").sort(() => Math.random() - 0.5).join("").slice(0, length)
}