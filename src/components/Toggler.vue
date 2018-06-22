<template>
    <a
        @click="$emit('input', !value)"
        href="javascript:void(0)"
        class="toggle"
        v-html="this.value ? this.hide : this.expand" />
</template>

<style lang="scss" scoped>
a {
    text-decoration: none;
    letter-spacing: (1em / 24);
}
</style>

<script>
import { formats } from '@/numberFormat'

export default {
    name: 'TransactionRow',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        expand: {
            type: String,
            default: '[+]'
        },
        hide: {
            type: String,
            default: '[&minus;]'
        },
    },
}
</script>