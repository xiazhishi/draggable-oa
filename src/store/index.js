// @ts-nocheck
import Vue from 'vue'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash-es'
import formDesign from './modules/formDesign'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        formDesign
    },
    mutations: {
        // 重置vuex本地储存状态
        resetStore (state) {
            Object.keys(state).forEach((key) => {
                state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
            })
        }
    },
    strict: process.env.NODE_ENV !== 'production'
})
