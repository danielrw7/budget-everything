<template>
    <div class="content">
        <div v-if="loaded">
            <div v-for="(budget, id) in budgets" :key="id">
                <router-link :to="{ name: 'DisplayBudget', params: { id } }">{{id}}</router-link>
            </div>

            <input v-model="budgetID" type="text" />
            <select v-model="formatType">
                <option v-for="(type, i) in formatTypes" :key="i" :value="type">
                    {{ type }}
                </option>
            </select>
            <button @click="addBudget" class="button-primary">Add</button>
        </div>
        <div v-else>Loading...</div>
    </div>
</template>

<script>
import { formats } from '@/numberFormat'

export default {
    name: 'ListBudgets',
    data() {
        const formatTypes = Object.keys(formats)
        return {
            loaded: false,
            budgetID: '',
            formatTypes,
            formatType: formatTypes[0]
        }
    },
    created() {
        this.$store.dispatch('load').then(() => {
            this.loaded = true
        })
    },
    computed: {
        budgets() {
            return this.$store.getters.budgets
        },
    },
    methods: {
        addBudget() {
            return this.$store.dispatch('saveBudget', {
                budget: {
                    id: this.budgetID,
                    formatType: this.formatType
                },
            }).then((budget) => {
                this.$store.dispatch('save')
            })
        }
    },
    components: {
    },
}
</script>