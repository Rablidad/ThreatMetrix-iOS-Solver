module.exports = function (axis, diff) {
    var sur = parseFloat(axis[axis.length - 1])
    var last = parseFloat(axis[axis.length - 2])
    return (sur - last) / diff
}