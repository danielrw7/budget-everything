export let locale = navigator.language
export let currencyCode = 'USD'

export function numberFormat(type, value) {
    return Intl.NumberFormat(...type).format(value)
}

export const formats = {
    decimal(value, decimals = null) {
        const options = {
            style: 'decimal',
        }
        if (typeof decimals == 'number') {
            options.maximumFractionDigits = decimals
        }
        return numberFormat([locale, options], value)
    },
    integer(value) {
        return formats.decimal(value, 0)
    },
    currency(value) {
        return numberFormat([locale, {
            style: 'currency',
            currency: currencyCode
        }], value)
    }
}

export function displayFormat(template, context) {
    const re = /\{[^\}]+\}/g
    // console.log(template, context)
    let result = template.replace(re, function (match) {
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

export function format(value, budget = {}, context = {}) {
    const res = formats[budget.formatType || 'integer'](value)
    if (budget.formatTemplate) {
        return displayFormat(budget.formatTemplate, Object.assign({
            value: res,
            rawValue: value,
            formatUnit: (Math.abs(value) != 1 ? (budget.formatUnitPlural || budget.formatUnit) : budget.formatUnit) || '',
            budget,
        }, context))
    }
    return res
}