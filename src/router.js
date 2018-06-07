import Vue from 'vue'
import VueRouter from 'vue-router'

import ListBudgets from './pages/ListBudgets'
import DisplayBudget from './pages/DisplayBudget'
import DisplayCategory from './pages/DisplayCategory'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'ListBudgets',
        component: ListBudgets
    },
    {
        path: '/index.html',
        name: 'ListBudgets',
        component: ListBudgets
    },
    {
        path: '/budget/:id',
        name: 'DisplayBudget',
        component: DisplayBudget
    },
    {
        path: '/budget/:budget/category/:id',
        name: 'DisplayCategory',
        component: DisplayCategory
    },
]

export default new VueRouter({
    mode: 'history',
    routes,
})
