module.exports = function xml2json(data) {
    try {
        const json = {}
        for (const xml of data.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
            const key = xml[1] || xml[3]
            const value = xml[2] && xml2json(xml[2])
            if (json[key] !== undefined) {
                if (!Array.isArray(json[key])) {
                    json[key] = [json[key]]
                }
                json[key].push((value && Object.keys(value).length) ? value : xml[2])
            } else {
                json[key] = (value && Object.keys(value).length) ? value : xml[2]
            }
        }
        return json
    } catch (error) {
        return data
    }
}