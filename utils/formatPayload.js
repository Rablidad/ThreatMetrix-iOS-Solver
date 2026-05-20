const math = require('mathjs')
const formatComponent = require('./formatComponent')

module.exports = function (components) {
    var payload = []
    for (var component of components) {
        payload.push(formatComponent(component))
    }
    return payload.join('|')
}