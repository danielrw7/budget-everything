<template>
    <div v-if="loaded">
        <table class="u-full-width">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                <CategoryRow v-for="(category, i) in budget.categories" :key="i"
                    :id="String(i)"
                    :category="category"
                    :budget="budget"
                    @update="saveCategory(i, ...arguments)" />
            </tbody>
        </table>

        <button @click="addCategory">Add Category</button>
    </div>
    <div v-else>Loading...</div>
</template>

<script>
import CategoryRow from '@/components/CategoryRow'

export default {
    name: 'DisplayBudget',
    props: {
    },
    data() {
        return {
            loaded: false,
        }
    },
    created() {
        this.$store.dispatch('load').then(() => {
            this.categories = this.budget.categories
            this.loaded = true
        })
    },
    computed: {
        id() {
            return this.$route.params.id
        },
        budget() {
            return this.$store.getters.budget(this.id)
        },
    },
    methods: {
        save() {
            this.$store.commit('budget', Object.assign({}, this.budget, {
                categories: this.categories
            }))

            this.loaded = false
            this.$store.dispatch('save').then(() => {
                this.loaded = true
            })
        },
        saveCategory(index, category) {
            this.$set(this.categories, index, category)
            this.$store.dispatch('saveBudget', {
                budget: Object.assign({}, this.budget, {
                    categories: this.categories
                })
            })
            this.$store.dispatch('save', () => {
                this.$forceUpdate()
            })
        },
        addCategory() {
            this.$set(this.categories, this.categories.length, {
                name: '',
                balance: 0,
                transactions: [],
            })
            this.$forceUpdate()
        }
    },
    components: {
        CategoryRow,
    },
}
</script>