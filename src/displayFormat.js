const re = /\{[^\}]+\}/g

export function displayFormat(template, context) {
    // console.log(template, context)
    let result = template.replace(re, function(match) {
        const key = match.slice(1, -1)
            .split('.')
            .map(part => part.trim())
            .filter(part => part.length)
        
        if (!key.length) {
            return ''
        }
        
        let keyValue = context
        for (let i in key) {
            const part = key[i]
            keyValue = keyValue && keyValue[part] ? keyValue[part] : ''
            if (!keyValue) {
                break
            }
        }
        return keyValue
    }).trim()
    if (result.match(re)) {
        return displayFormat(result, context)
    }
    return result
}