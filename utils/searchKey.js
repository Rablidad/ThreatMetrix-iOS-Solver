module.exports = (object, name) => {
    if (typeof object !== 'object' || object === null) return null
    if (name in object) return object[name]
    for (var key in object) if (object.hasOwnProperty(key)) {
        var value = module.exports(object[key], name)
        if (value !== null) return value
    }
    return null
}