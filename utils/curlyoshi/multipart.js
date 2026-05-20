const { readFile } = require('fs')
const { basename } = require('path')

module.exports = function (data, boundary, callback) {
    if (typeof data !== 'object' || typeof data.pipe === 'function') {
        return callback(new Error('Multipart builder expects data as key/val object.'))
    }

    let body = ''
    var object = flatten(data)
    var count = Object.keys(object).length

    if (count === 0) {
        return callback(new Error('Empty multipart body. Invalid data.'))
    }

    function done(err, section) {
        if (err) return callback(err)
        if (section) body += section
        --count || callback(null, body + '--' + boundary + '--')
    }

    for (const key in object) {
        const value = object[key]
        if (value === null || typeof value === 'undefined') {
            done()
        } else if (Buffer.isBuffer(value)) {
            const part = { buffer: value, contentType: 'application/octet-stream' }
            generate_part(key, part, boundary, done)
        } else {
            const part = (value.buffer || value.file || value.contentType) ? value : { value: value }
            generate_part(key, part, boundary, done)
        }
    }
}

function generate_part(name, part, boundary, callback) {
    let returnPart = `--${boundary}\r\n`
    returnPart += `Content-Disposition: form-data; name="${name}"`

    function append(data, filename) {
        if (data) {
            const binary = part.contentType.indexOf('text') === -1
            returnPart += `; filename="${encodeURIComponent(filename)}"\r\n`
            if (binary) returnPart += 'Content-Transfer-Encoding: binary\r\n'
            returnPart += `Content-Type: ${part.contentType}\r\n\r\n`
            returnPart += binary ? data.toString('binary') : data.toString('utf8')
        }
        callback(null, returnPart + '\r\n')
    }

    if ((part.file || part.buffer) && part.contentType) {
        const filename = part.filename ? part.filename : part.file ? basename(part.file) : name
        if (part.buffer) return append(part.buffer, filename)

        readFile(part.file, (err, data) => {
            if (err) return callback(err)
            append(data, filename)
        })
    } else {
        if (typeof part.value === 'object') {
            return callback(new Error(`Object received for ${name}, expected string.`))
        }
        if (part.contentType) {
            returnPart += '\r\n'
            returnPart += `Content-Type: ${part.contentType}`
        }
        returnPart += '\r\n\r\n'
        returnPart += Buffer.from(String(part.value), 'utf8').toString('binary')
        append()
    }
}

function flatten(object, into, prefix) {
    into = into || {}
    for (const key in object) {
        const prefix_key = prefix ? `${prefix}[${key}]` : key
        const prop = object[key]
        if (prop && typeof prop === 'object' && !(prop.buffer || prop.file || prop.contentType)) {
            flatten(prop, into, prefix_key)
        } else {
            into[prefix_key] = prop
        }
    }

    return into
}