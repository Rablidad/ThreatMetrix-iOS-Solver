module.exports = function (vector) {
    var x = vector.x
    var y = vector.y
    var z = vector.z
    return { x: parseFloat(y), y: parseFloat(x), z: parseFloat(-z) }
}