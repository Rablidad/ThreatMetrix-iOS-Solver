module.exports = function (vector) {
    var magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2))
    return { x: vector.x / magnitude, y: vector.y / magnitude, z: vector.z / magnitude }
}