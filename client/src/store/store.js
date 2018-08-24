import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true, //state can only be changed through action
    state: {
        MenuConfirmation: false,
        DriverMenuConfirmation: false,
        stopDriverInterval: false
    }, //keeping track of changes

    mutations: {
        setMenuConfirmation (state, menuConfirmation){
            state.MenuConfirmation = menuConfirmation
        },
        setDriverMenuConfirmation (state, DriverMenuConfirmation){
            state.DriverMenuConfirmation = DriverMenuConfirmation
        },
        setDriverIntervalStatus (state, stopDriverInterval){
            state.stopDriverInterval = stopDriverInterval
        }
    },
    actions: {
        setMenuConfirmation ({commit}, menuConfirmation) {
            commit('setMenuConfirmation', menuConfirmation) //do async calls/logic
        },
        setDriverMenuConfirmation ({commit}, DriverMenuConfirmation) {
            commit('setDriverMenuConfirmation', DriverMenuConfirmation) //do async calls/logic
        },
        setDriverIntervalStatus ({commit}, stopDriverInterval) {
            commit('setDriverIntervalStatus', stopDriverInterval) //do async calls/logic
        },
    }
})