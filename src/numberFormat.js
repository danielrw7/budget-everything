export let locale = navigator.language
export let currencyCode = 'USD'

export function format(type, value) {
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
        return format([locale, options], value)
    },
    integer(value) {
        return formats.decimal(value, 0)
    },
    currency(value) {
        return format([locale, {
            style: 'currency',
            currency: currencyCode
        }], value)
    }
}

