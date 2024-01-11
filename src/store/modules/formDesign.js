export default {
    namespaced: true,
    state: {
        chooseGridKey: '',
        chooseElementKey: '',
        elementMargin: 10,
    },
    mutations: {
        updateGridKey (state, value) {
            state.chooseGridKey = value
            state.chooseElementKey = ''
        },
        updateElementKey (state, value) {
            state.chooseElementKey = value
            state.chooseGridKey = ''
        },
        updateElementMargin (state, value) {
            state.elementMargin = value
        }
    },
    actions: {
    },
    getters: {
    }
}
