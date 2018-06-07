import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        budgets: {},
    },
    getters: {
        budgets(state) {
            return state.budgets
        },
        budget(state, getters) {
            return (id) => {
                const budget = Object.assign({}, getters.budgets[id])
                if (!budget.formatType) {
                    budget.formatType = 'integer'
                }
                if (!budget.categories) {
                    budget.categories = []
                }
                return budget
            }
        }
    },
    mutations: {
        budgets(state, budgets) {
            return Vue.set(state, 'budgets', budgets)
        },
        budget(state, budget) {
            return Vue.set(state.budgets, budget.id, budget)
        }, 
        renameBudget(state, { oldID, newID }) {
            Vue.set(state.budgets, newID, state.budgets[oldID])
            Vue.delete(state.budgets, oldID)
        }
    },
    actions: {
        load({ commit, getters }) {
            let budgets
            try {
                budgets = JSON.parse(localStorage.getItem('budgets'))
            } catch (e) {
            }
            if (!budgets || typeof budgets != 'object') {
                budgets = {}
            }
            commit('budgets', budgets)
            return Promise.resolve(getters.budgets)
        },
        save({ getters }) {
            localStorage.setItem('budgets', JSON.stringify(getters.budgets))
            return Promise.resolve(getters.budgets)
        },
        saveBudget({ commit, getters }, { budget }) {
            commit('budget', budget)
            console.log(budget)
            console.log(getters.budget(budget))
            console.log(getters.budgets)
            return Promise.resolve(getters.budget(budget.id))
        }
    }
})