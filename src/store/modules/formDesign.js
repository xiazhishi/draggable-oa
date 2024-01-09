export default {
    namespaced: true,
    state: {
        grid: null
    },
    mutations: {
        updateGrid (state, value) {
            console.log('updateGrid', value)
            state.grid = value
        }
    },
    actions: {
    },
    getters: {
    }
}
