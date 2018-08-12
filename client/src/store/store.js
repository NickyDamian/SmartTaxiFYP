import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true, //state can only be changed through action
    state: {
        MenuConfirmation: false
    }, //keeping track of changes

    mutations: {
        setMenuConfirmation (state, menuConfirmation){
            state.MenuConfirmation = menuConfirmation
        }
    },
    actions: {
        setMenuConfirmation ({commit}, menuConfirmation) {
            commit('setMenuConfirmation', menuConfirmation) //do async calls/logic
        }
    }
})