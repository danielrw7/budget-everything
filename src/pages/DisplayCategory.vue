<template>
    <div v-if="loaded">
        <table class="u-full-width">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <TransactionRow v-for="(transaction, i) in transactions" :key="i"
                    :transaction="transaction"
                    :category="category"
                    :budget="budget"
                    @update="saveTransaction(i, ...arguments)" />
            </tbody>
        </table>

        <button @click="addTransaction">Add Transaction</button>
    </div>
    <div v-else>Loading...</div>
</template>

<script>
import TransactionRow from '@/components/TransactionRow'

export default {
    name: 'DisplayCategory',
    props: {
    },
    data() {
        return {
            loaded: false,
        }
    },
    created() {
        this.$store.dispatch('load').then(() => {
            this.loaded = true
            this.transactions = this.category.transactions
        })
    },
    computed: {
        budgetID() {
            return this.$route.params.budget
        },
        budget() {
            return this.$store.getters.budget(this.budgetID)
        },
        id() {
            return this.$route.params.id
        },
        category() {
            console.log(this.budget, this.id)
            return this.budget.categories[this.id]
        },
    },
    methods: {
        save() {
            if (!this.parsedData) {
                return
            }

            this.$store.commit('budget', this.parsedData)

            this.loaded = false
            this.$store.dispatch('save').then(() => {
                this.loaded = true
            })
        },
        saveTransaction(index, transaction) {
            this.$set(this.transactions, index, transaction)
            const categories = this.budget.categories
            categories[this.id] = Object.assign({}, this.category, {
                transactions: this.transactions
            })
            this.$store.dispatch('saveBudget', {
                budget: Object.assign({}, this.budget, {
                    categories
                })
            })
            this.$store.dispatch('save', () => {
                this.$forceUpdate()
            })
        },
        addTransaction() {
            this.$set(this.transactions, this.transactions.length, {
                name: '',
                value: 0,
            })
            this.$forceUpdate()
        }
    },
    components: {
        TransactionRow,
    },
}
</script>