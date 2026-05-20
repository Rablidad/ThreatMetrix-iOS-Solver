module.exports = function (vector) {
    var magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2))
    var degrees = Math.acos(vector.z / magnitude) * 180 / Math.PI
    return degrees
}