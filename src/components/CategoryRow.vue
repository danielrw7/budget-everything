<template>
    <tr>
        <td class="name" @dblclick="editName">
            <input
                ref="name"
                type="text"
                v-if="name.editing"
                v-model="name.value"
                @keyup.enter="saveName" />
            <span class="label" v-else>
                {{ category.name }}
            </span>
        </td>
        <td :title="balance">
            <router-link :to="{
                name: 'DisplayCategory',
                params: {
                    budget: budget.id,
                    id
                }
            }">
                {{ value }}
            </router-link>
        </td>
    </tr>
</template>

<style lang="scss" scoped>
.label {
    display: block;
    height: 38px;
    padding-top: 7px;
    padding-left: 11px;
}
</style>


<script>
import { format } from '@/numberFormat'

export default {
    name: 'CategoryRow',
    props: {
        id: String,
        budget: {
            type: Object,
            default: {}
        },
        category: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            name: {
                editing: false,
                value: this.category.name
            }
        }
    },
    created() {
        if (!this.category.name) {
            this.editName()
        }
    },
    computed: {
        balance() {
            if (!(this.category.transactions && this.category.transactions.length)) {
                return this.category.balance
            } else if (this.category.transactions.length < 2) {
                return this.category.balance - this.category.transactions[0].value
            }
            return this.category.balance - this.category.transactions.reduce((a, b) => a.value + b.value)
        },
        value() {
            return format(this.balance, this.budget, {
                category: this.category
            })
        }
    },
    methods: {
        editName() {
            this.name.editing = true
            this.$nextTick(() => {
                this.$refs.name.focus()
                this.$refs.name.select()
            })
        },
        saveName() {
            if (!this.name.value) return

            this.$emit('update', Object.assign({}, this.category, {
                name: this.name.value
            }))
            this.name.editing = false
        },
    }
}
</script>