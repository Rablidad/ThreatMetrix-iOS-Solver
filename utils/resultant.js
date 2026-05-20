const math = require('mathjs')

module.exports = function (vector1, vector2, vector3) {
    var y = math.asin(vector1.x)
    var z = math.atan2(vector2.x, vector3.x)
    var x = math.atan2(vector1.y, vector1.z)
    return {
        x: x * 180 / Math.PI,
        y: -y * 180 / Math.PI,
        z: z * 180 / Math.PI
    }
}