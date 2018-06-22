<template>
    <tr @dblclick="startEditing">
        <td class="name">
            <input
                ref="name"
                v-if="editing"
                v-model="name"
                type="text"
                @keyup.enter="save" />
            <span v-else>
                {{ transaction.name }}
            </span>
        </td>
        <td class="value">
            <input
                ref="value"
                v-if="editing"
                v-model="value"
                type="number"
                @keyup.enter="save" />
            <span :title="transaction.value" v-else>
                {{ formattedValue }}
            </span>
        </td>
    </tr>
</template>

<script>
import { format } from '@/numberFormat'

export default {
    name: 'TransactionRow',
    props: {
        transaction: {
            type: Object,
            default: () => {}
        },
        category: {
            type: Object,
            default: {}
        },
        budget: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            editing: false,
            name: this.transaction.name,
            value: this.transaction.value,
        }
    },
    created() {
        if (!this.transaction.name) {
            this.startEditing()
        }
    },
    computed: {
        formattedValue() {
            return format(this.transaction.value, this.budget, {
                category: this.category
            })
        }
    },
    methods: {
        startEditing(target) {
            this.editing = true
            this.$nextTick(() => {
                this.$refs.name.focus()
                this.$refs.name.select()
            })
        },
        save() {
            if (!this.name) return
            this.$emit('update', Object.assign({}, this.transaction, {
                name: this.name,
                value: Number(this.value) || 0
            }))
            this.editing = false
        },
    }
}
</script>