const math = require('mathjs')
const toFixed = require('./toFixed')

module.exports = function (array) {
    var min = toFixed(math.min(array), 3)
    var max = toFixed(math.max(array), 3)
    var avg = toFixed(math.mean(array), 3)
    var med = toFixed(math.median(array), 3)
    var std = toFixed(math.std(array), 3)
    var mad = toFixed(math.mad(array), 3)    
    return [min, max, avg, med, std, mad].join(':')
}