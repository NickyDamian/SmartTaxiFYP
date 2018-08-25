import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true, //state can only be changed through action
    state: {
        MenuConfirmation: false,
        DriverMenuConfirmation: false,
        stopDriverInterval: false,
        passengerStartLocation: null,
        passengerEndLocation: null
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
        },
        setPassengerStartLocation (state, passengerStartLocation){
            state.passengerStartLocation = passengerStartLocation
        },
        setPassengerEndLocation (state, passengerEndLocation){
            state.passengerEndLocation = passengerEndLocation
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
        setPassengerStartLocation ({commit}, passengerStartLocation) {
            commit('setPassengerStartLocation', passengerStartLocation) //do async calls/logic
        },
        setPassengerEndLocation ({commit}, passengerEndLocation) {
            commit('setPassengerEndLocation', passengerEndLocation) //do async calls/logic
        }
    }
})