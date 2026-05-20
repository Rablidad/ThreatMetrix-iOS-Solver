module.exports = (length, upperCase = false) => {
    var result = ''
    var characters = '0123456789abcdef'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return upperCase ? result.toLocaleUpperCase() : result
}