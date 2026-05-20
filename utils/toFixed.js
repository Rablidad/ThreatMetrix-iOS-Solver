module.exports = function (num, fixed) {    
    if (num.toString().includes('.') && num.toString().includes('e-')) num = num.toFixed(5)
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?')
    var result = num.toString().match(re)[0]
    if (result.includes('.')) {
        for (var i = result.length - 1; i >= 0; i--) {
            if (result[i] === '.') break
            if (result[i] === '0') result = result.substring(0, result.length - 1)
            else break
        }
    }
    if (result[result.length - 1] === '.') result = result.substring(0, result.length - 1)
    return result
}