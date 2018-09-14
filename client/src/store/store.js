import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true, //state can only be changed through action
    state: {
        loadGoogleMapsAPI: false, //Call the script only once
        Gmap: null, //Promise request to create the Gmap
        stopThePassengerInterval: false, //Once request is sent, stop the interval
        startThePassengerInterval: false, //Re-launch interval if nearby drivers are available
        MenuConfirmation: false, //menu confirmation before booking for a ride (Passenger)
        DriverMenuConfirmation: false, //menu confirmation before accepting a request (Driver)
        stopDriverInterval: false, //Stop the interval when driver has accepted a request
        passengerStartLocation: null, //Save the passenger Start Location (Wil be reused)
        passengerEndLocation: null, //Save the passenger End Location (Will be reused)
        typeOfUser: null, //Display the different type of ride info based on the type of user
        rideInfo: false, //Display the ride info if user wants to know information about the driver/passenger
        displayRouteForJourney: false, //Display journey route once driver has reached the start location
        cancelRequest: false, //Driver has cancel the request since passenger hasn`t show up
        displayJourneyCompletedForPassenger: false, //Allow passenger to provide their feeback once journey has been completed
        commentForPassenger: null, //Display the additional note the passenger has written when driver accepted request
        journeyCompleted: null, //State when the journey is completed
        clientName: 'Nicholas Damian',
        clientEmailAddress: 'nicky@gmail.com',
        driverLoggedOut: false, //State when driver logs out of app (delete driver from server and inform all other passenger app)
        passengerLoggedOut: false, //State when passenger logs out of app
        token: true,
        searchForPlaces: false //Show search box and hide autocomplete when true
    }, //keeping track of changes

    mutations: {
        setLoadGoogleMapsAPI (state, loadGoogleMapsAPI){
            state.loadGoogleMapsAPI = loadGoogleMapsAPI
        },
        setGmap (state, Gmap){
            state.Gmap = Gmap
        },
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
        },
        setCommentForPassenger (state, commentForPassenger){
            state.commentForPassenger = commentForPassenger
        },
        setJourneyCompleted (state, journeyCompleted){
            state.journeyCompleted = journeyCompleted
        },
        setStopThePassengerInterval (state, stopThePassengerInterval){
            state.stopThePassengerInterval = stopThePassengerInterval
        },
        setStartThePassengerInterval (state, startThePassengerInterval){
            state.startThePassengerInterval = startThePassengerInterval
        },
        setStartThePassengerInterval (state, startThePassengerInterval){
            state.startThePassengerInterval = startThePassengerInterval
        },
        setDriverLoggedOut (state, driverLoggedOut){
            state.driverLoggedOut = driverLoggedOut
        },
        setPassengerLoggedOut (state, passengerLoggedOut){
            state.passengerLoggedOut = passengerLoggedOut
        },
        setToken (state, token){
            state.token = token
        },
        setSearchForPlaces (state, searchForPlaces){
            state.searchForPlaces = searchForPlaces
        }
    },
    actions: {
        setLoadGoogleMapsAPI ({commit}, loadGoogleMapsAPI) {
            commit('setLoadGoogleMapsAPI', loadGoogleMapsAPI) //do async calls/logic
        },
        setGmap ({commit}, Gmap) {
            commit('setGmap', Gmap) //do async calls/logic
        },
        setMenuConfirmation ({commit}, menuConfirmation) {
            commit('setMenuConfirmation', menuConfirmation)
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
        },
        setCommentForPassenger ({commit}, commentForPassenger) {
            commit('setCommentForPassenger', commentForPassenger)
        },
        setJourneyCompleted ({commit}, journeyCompleted) {
            commit('setJourneyCompleted', journeyCompleted)
        },
        setStopThePassengerInterval ({commit}, stopThePassengerInterval) {
            commit('setStopThePassengerInterval', stopThePassengerInterval)
        },
        setStartThePassengerInterval ({commit}, startThePassengerInterval) {
            commit('setStartThePassengerInterval', startThePassengerInterval)
        },
        setDriverLoggedOut ({commit}, driverLoggedOut) {
            commit('setDriverLoggedOut', driverLoggedOut)
        },
        setPassengerLoggedOut ({commit}, passengerLoggedOut) {
            commit('setPassengerLoggedOut', passengerLoggedOut)
        },
        setToken ({commit}, token) {
            commit('setToken', token)
        },
        setSearchForPlaces ({commit}, searchForPlaces) {
            commit('setSearchForPlaces', searchForPlaces)
        }
    }
})