<template>
    <div v-if="loaded">
        <div class="section">
            <h5>
                <Toggler v-model="show.formatting" />
                Formatting
            </h5>
            <table class="no-bottom-border" v-if="show.formatting">
                <tr>
                    <th>Format Type:</th>
                    <td>
                        <select v-model="budget.formatType">
                            <option v-for="(type, i) in formatTypes" :key="i" :value="type">
                                {{ type }}
                            </option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Format Unit:</th>
                    <td>
                        <input
                            v-model="budget.formatUnit"
                            type="text" />
                    </td>
                </tr>
                <tr>
                    <th>Format Unit (Plural):</th>
                    <td>
                        <input
                            v-model="budget.formatUnitPlural"
                            type="text" />
                    </td>
                </tr>
                <tr>
                    <th>Format Template:</th>
                    <td>
                        <input
                            v-model="budget.formatTemplate"
                            type="text" />
                    </td>
                </tr>
            </table>
            <button
                v-if="show.formatting"
                @click="save({})"
                class="button-primary">Save</button>
        </div>

        <div class="section">
            <h5>
                <Toggler v-model="show.timing" />
                Timing
            </h5>
            <table class="no-bottom-border" v-if="show.timing">
                <tr>
                    <th>Interval:</th>
                    <td>
                        <select v-model="budget.interval">
                            <option v-for="(type, i) in intervals" :key="i" :value="type">
                                {{ type }}
                            </option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>

        <button
            v-if="hasChanges"
            @click="save()"
            class="button-primary">Save Changes</button>

        <div class="section transactions">
            <h5>
                <Toggler v-model="show.categories" />
                Categories
            </h5>
            <table class="u-full-width" v-if="show.categories">
                <thead>
                    <tr>
                        <th>Category Name</th>
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
            <button @click="addCategory" v-if="show.categories">Add Category</button>
        </div>
    </div>
    <div v-else>Loading...</div>
</template>

<style lang="scss" scoped>
.section {
    padding: 0.5em 0;
    border-bottom: 1px solid #e1e1e1;

    $section-padding: 3.5rem;
    padding-left: $section-padding;
    h5 {
        margin-left: -$section-padding;
        margin-bottom: 0;
    }
}
table {
    margin-bottom: 0;
}
button {
    margin-top: 2rem;
}
</style>


<script>
import CategoryRow from '@/components/CategoryRow'
import Toggler from '@/components/Toggler'
import { formats } from '@/numberFormat'

export default {
    name: 'DisplayBudget',
    props: {
    },
    data() {
        const formatTypes = Object.keys(formats)
        return {
            formatTypes,

            loaded: false,
            budget: false,
            hasChanges: false,
            intervals: ['month','week','year','manual'],

            show: {
                categories: true,
            }
        }
    },
    created() {
        this.hasChanges = false
        this.$store.dispatch('load').then(() => {
            this.budget = Object.assign({}, this.$store.getters.budget(this.id))
            this.budget.formatType = this.budget.formatType || this.formatTypes[0]
            this.categories = this.budget.categories
            this.loaded = true
        })
    },
    computed: {
        id() {
            return this.$route.params.id
        },
    },
    watch: {
        budget: {
            handler(oldVal, newVal) {
                console.log(oldVal, newVal)
                this.hasChanges = true
            },
            deep: true
        }
    },
    methods: {
        save(budget = {}) {
            this.loaded = false
            console.log('here',Object.assign({}, this.budget, budget))
            return this.$store.dispatch('saveBudget', {
                budget: Object.assign({}, this.budget, budget)
            }).then(() => {
                this.$store.dispatch('save').then(() => {
                    this.budget = Object.assign({}, this.$store.getters.budget(this.id))
                    this.categories = this.budget.categories
                    this.loaded = true
                    this.$nextTick(() => {
                        this.hasChanges = false
                    })
                })
            })
        },
        saveCategories() {
            this.save({
                categories: this.categories
            })
        },
        saveCategory(index, category) {
            this.$set(this.categories, index, category)
            this.saveCategories()
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
        Toggler,
    },
}
</script>