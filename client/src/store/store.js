import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true, //state can only be changed through action
    state: {
        MenuConfirmation: false, //menu confirmation before booking for a ride (Passenger)
        DriverMenuConfirmation: false, //menu confirmation before accepting a request (Driver)
        stopDriverInterval: false, //Stop the interval when driver has accepted a request
        passengerStartLocation: null, //Save the passenger Start Location (Wil be reused)
        passengerEndLocation: null, //Save the passenger End Location (Will be reused)
        typeOfUser: null, //Display the different type of ride info based on the type of user
        rideInfo: false, //Display the ride info if user wants to know information about the driver/passenger
        displayRouteForJourney: false, //Display journey route once driver has reached the start location
        cancelRequest: false, //Driver has cancel the request since passenger hasn`t show up
        displayJourneyCompletedForPassenger: false
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
        },
        setTypeOfUser (state, typeOfUser){
            state.typeOfUser = typeOfUser
        },
        setRideInfo (state, rideInfo){
            state.rideInfo = rideInfo
        },
        setDisplayRouteForJourney (state, displayRouteForJourney){
            state.displayRouteForJourney = displayRouteForJourney
        },
        setCancelRequest (state, cancelRequest){
            state.cancelRequest = cancelRequest
        },
        setDisplayJourneyCompletedForPassenger (state, displayJourneyCompletedForPassenger){
            state.displayJourneyCompletedForPassenger = displayJourneyCompletedForPassenger
        }
    },
    actions: {
        setMenuConfirmation ({commit}, menuConfirmation) {
            commit('setMenuConfirmation', menuConfirmation) //do async calls/logic
        },
        setDriverMenuConfirmation ({commit}, DriverMenuConfirmation) {
            commit('setDriverMenuConfirmation', DriverMenuConfirmation)
        },
        setDriverIntervalStatus ({commit}, stopDriverInterval) {
            commit('setDriverIntervalStatus', stopDriverInterval)
        },
        setPassengerStartLocation ({commit}, passengerStartLocation) {
            commit('setPassengerStartLocation', passengerStartLocation)
        },
        setPassengerEndLocation ({commit}, passengerEndLocation) {
            commit('setPassengerEndLocation', passengerEndLocation)
        },
        setTypeOfUser ({commit}, typeOfUser) {
            commit('setTypeOfUser', typeOfUser)
        },
        setRideInfo ({commit}, rideInfo) {
            commit('setRideInfo', rideInfo)
        },
        setDisplayRouteForJourney ({commit}, displayRouteForJourney) {
            commit('setDisplayRouteForJourney', displayRouteForJourney)
        },
        setCancelRequest ({commit}, cancelRequest) {
            commit('setCancelRequest', cancelRequest)
        },
        setDisplayJourneyCompletedForPassenger ({commit}, displayJourneyCompletedForPassenger) {
            commit('setDisplayJourneyCompletedForPassenger', displayJourneyCompletedForPassenger)
        }
    }
})