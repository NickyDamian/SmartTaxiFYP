<template>
  <v-app>
    <SideNavigation v-if="!$store.state.rideInfo && $store.state.submenuPage === null"></SideNavigation>
    <div v-show="(!$store.state.rideInfo && !rideInfo) && $store.state.submenuPage === null">
      <div class="start-location">
        <v-icon color="blue" class="pl-2">map</v-icon>
        <input class="search-box" @click="autoComplete" id="pac-input" type="text" placeholder="Starting location">
      </div>
      <v-divider></v-divider>
      <div class="end-location">
        <v-icon color="red" class="pl-2">location_on</v-icon>
        <input class="search-box" @click="autoComplete2" id="pac-input2" type="text" placeholder="I'm going to...">
      </div>
    </div>
    <v-toolbar v-if="(!$store.state.rideInfo && !rideInfo && $store.state.searchForPlaces) && $store.state.submenuPage === null" class="keywordSearch">
      <v-text-field hide-details prepend-icon="home" single-line label="Search" v-model="searchByKeywords"></v-text-field>
      <v-btn icon @click="searchForPlaces()">
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
    <div v-show="$store.state.submenuPage === null" style="height:100%;width:100%" id="map"></div>
    <v-btn v-if="(!$store.state.MenuConfirmation && !rideInfo) && $store.state.submenuPage === null" color="primary" @click="findDriver">
      <v-icon class="pr-2">directions_car</v-icon> Find Driver
    </v-btn>
    <v-btn v-if="(!$store.state.rideInfo && rideInfo) && $store.state.submenuPage === null" color="primary" @click="$store.dispatch('setRideInfo', true)">
      <v-icon class="pr-2">directions_car</v-icon> View Ride Info
    </v-btn>
    <ConfirmationDialogBox v-if="$store.state.MenuConfirmation && $store.state.submenuPage === null" :time='this.time' :startAddress='this.theStartAddress'
      :endAddress='this.theEndAddress' :money='this.money' :data='this.setPoints' :start='this.start' :end='this.end'
      :distance='this.distance'></ConfirmationDialogBox>
    <RideInfo v-show="$store.state.rideInfo && $store.state.submenuPage === null" :driverID='this.driverID' :clientName='this.driverName'
      :rideActuallyCompleted='this.rideActuallyCompleted' :startAddress='this.theStartAddress' :endAddress='this.theEndAddress'
      :money='this.money' :driverEmailAddress='this.driverEmailAddress'></RideInfo>
      <History v-if="$store.state.submenuPage === 'history'"></History>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :left="x === 'left'" :multi-line="mode === 'multi-line'"
      :right="x === 'right'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn color="red" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="notifyPassengerDialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Smart Taxi
        </v-card-title>

        <v-card-text>
          {{this.driverArrivedMessage}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="notifyPassengerDialog = false, $store.dispatch('setRideInfo', false)">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="searchByKeywordsDialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          <v-btn dark icon @click="searchByKeywordsDialog = false, selectedSearchPlaces = null, searchByKeywords = ''">
            <v-icon class="pr-1">arrow_back</v-icon>
          </v-btn>
          Nearby Places
        </v-card-title>
        <div v-for="(selectedSearchPlace, index) in selectedSearchPlaces" :key='index'>
          <v-flex class="pt-2 pr-2 pb-1">
            <v-icon color='red' class="time-icon">home</v-icon>
            <label style="font-weight: 600; font-size: 18px">{{selectedSearchPlace.placeName}}</label>
          </v-flex>
          <v-img :src="selectedSearchPlace.picture" aspect-ratio="1.7"></v-img>
          <v-rating :value='selectedSearchPlace.rating' readonly half-increments></v-rating>
          <v-btn color="primary" @click="searchByKeywordsDialog = false, selectedSearchPlaces = null, getCurrentLocation(selectedSearchPlace.location), searchByKeywords = ''">
            <v-icon>directions_car</v-icon>
            Go Here
          </v-btn>
          <v-divider class="mt-2"></v-divider>
        </div>
        <div v-if="noPlaceFound">
          <v-card-text>
            Unable to find the any nearby places. Please try again. Thank you.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="searchByKeywordsDialog = false, noPlaceFound = false, selectedSearchPlaces = null, searchLocationStatus = false, searchByKeywords = ''">
              Okay
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import History from './Reuse/History.vue'
  import Footer from './Reuse/Footer.vue'
  import SideNavigation from './Reuse/SideNavigation.vue'
  import ConfirmationDialogBox from './Reuse/Confirmation-Box.vue'
  import RideInfo from './Reuse/InTransitStatusPage.vue'
  import LocationService from '@/services/LocationService'
  import PriceService from '@/services/PriceService'

  var getStartPlace
  var getEndPlace
  var lat1 = 3.0580092
  var lng1 = 101.7011474

  export default {
    data() {
      return {
        place1: getStartPlace,
        place2: getEndPlace,
        driverEmailAddress: null,
        currentFareRate: null,
        searchBank: [{
            placeName: 'Maybank',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489023427546710016/Maybank.png",
            rating: 4,
            location: [{
              lat: 3.047285,
              lng: 101.689007
            }]
          },
          {
            placeName: 'Standard Chartered',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489037973484994570/unknown.png",
            rating: 4,
            location: [{
              lat: 3.055845,
              lng: 101.704086
            }]
          },
        ],
        searchDiner: [{
            placeName: 'StarBucks Coffee',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489046128483106817/unknown.png",
            rating: 4.5,
            location: [{
              lat: 3.055845,
              lng: 101.704086
            }]
          },
          {
            placeName: 'Murni',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489046703136178178/unknown.png",
            rating: 4,
            location: [{
              lat: 3.060171,
              lng: 101.667576
            }]
          },
          {
            placeName: 'KFC',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489045226988634122/unknown.png",
            rating: 3.5,
            location: [{
              lat: 3.049132,
              lng: 101.679663
            }]
          },
          {
            placeName: 'Picante',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489045680434839563/unknown.png",
            rating: 3,
            location: [{
              lat: 3.047285,
              lng: 101.689007
            }]
          }
        ],
        searchPetrolStation: [{
            placeName: 'Shell Station',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489048658013323264/unknown.png",
            rating: 4.5,
            location: [{
              lat: 3.055829,
              lng: 101.704526
            }]
          },
          {
            placeName: 'Petronas Station',
            picture: "https://cdn.discordapp.com/attachments/303839139554394112/489048032760037376/unknown.png",
            rating: 4,
            location: [{
              lat: 3.047285,
              lng: 101.689007
            }]
          }
        ],
        noPlaceFound: false,
        selectedSearchPlaces: null,
        searchByKeywords: '',
        searchByKeywordsDialog: false,
        rideActuallyCompleted: false,
        driverID: null,
        driverName: null,
        driverArrivedMessage: null,
        notifyPassengerDialog: false,
        rideInfo: false,
        start: null,
        end: null,
        distance: null,
        selectedDriverMarker: null,
        vueGMap: null,
        confirm: true,
        time: null,
        money: null,
        theStartAddress: null,
        theEndAddress: null,
        options: {
          componentRestrictions: {
            country: "my"
          }
        },
        globalOptions: () => ({
          zoom: 14,
          center: {
            lat: lat1,
            lng: lng1
          },
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'terrain', 'satellite']
          }
        }),
        input: null,
        input2: null,
        autocomplete: null,
        autocomplete2: null,
        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
        text: null,
        id: null,
        setPoints: [],
        driverLocationInterval: null,
        leGmap: null
      }

    },

    sockets: {
      //Check if connection has been made
      connect() {
        console.log('Client Socket has been connected')
      },
      rideActuallyCompleted(data) { //Let passenger rate the driver once journey is completed
        this.rideActuallyCompleted = data.message
      },
      requestStatusToAll(data) {
        var self = this
        setTimeout(() => {
          //Clear driver from the marker array and maps to avoid messing the sync-data (driver no longer available)
          for (var i = 0; self.setPoints[i] != undefined; ++i) {
            if (data.driverId === self.setPoints[i].id) {
              var removeThisMarkerFromMap = self.setPoints[i]
              removeThisMarkerFromMap.setMap(null) //Remove marker from maps
              self.setPoints.splice(i, 1) //Remove marker from array
            }
          }
        }, 2000)

      },
      //Listen for event on any message from the server
      //request Status is triggered when driver accepts or declines the request
      requestStatus(data) {
        this.$store.dispatch('setMenuConfirmation', false) //Hide confirm ride booking box
        console.log("Kelf and Don kappa pride")
        //Delete the driver from the marker array since driver is no longer available
        if (data.message == 'Accepted') {
          this.driverID = data.driverId
          this.driverName = data.driverName
          this.driverEmailAddress = data.driverEmailAddress
          this.rideInfo = true //Show the ride info if driver accept the ride request
          this.setPoints = [] //Clear all the available driver markers
          this.searchLocationStatus = false
        } else {
          this.startTheInterval() //Start the interval
          this.snackbar = true
          this.text = 'Driver Unavailable. Please try again!'
        }
        //Refresh the map without markers
        this.getRoute()
      },
      //Watch the location of the driver once request has been accepted
      sendTheSelectedDriverLocation(data) {
        var self = this
        if (this.selectedDriverMarker) {
          // Marker already created - Move it
          this.selectedDriverMarker.setPosition(data.location);

        } else {
          // Marker does not exist - Create it
          this.selectedDriverMarker = new google.maps.Marker({
            position: data.location,
            map: self.vueGMap,
            icon: 'https://cdn.discordapp.com/attachments/261814160344481792/478169653538193408/Driver.png'
          });
        }
      },
      //Notify the passenger that the driver has reached the starting location
      notifyDriverHasReached(data) {
        this.driverArrivedMessage = data.response
        this.notifyPassengerDialog = data.message
      },
      theJourneyHasBegun(data) {
        this.$store.dispatch('setDisplayJourneyCompletedForPassenger', true) //Passenger cannot cancel booking once in the driver's car
      },
      canceledRequest(data) {
        this.driverArrivedMessage = data.response
        this.notifyPassengerDialog = data.message
        this.selectedDriverMarker = null
        getStartPlace = null
        getEndPlace = null
        this.rideInfo = false
        this.createGoogleMaps().then(this.initGoogleMaps, this.googleMapsFailedToLoad)
        //Start interval for getting driver location
        this.startTheInterval()
      }
    },

    mounted() {
      this.$store.dispatch('setTypeOfUser', 'Passenger') //Set User as Passenger
      var self = this
      console.log('Client socket has been connected Kappa', this.$socket.id)

      //Create the map
      this.createGoogleMaps().then(this.initGoogleMaps, this.googleMapsFailedToLoad)

      //Reset the autocompleted place back to null
      getStartPlace = null
      getEndPlace = null

      //Start interval for getting driver location
      this.startTheInterval()

      //Stop the interval whenever a ride request is sent to the driver
      this.stopTheInterval()

      //When passenger cancel request
      this.passengerCanceledRequest()

      //Journey Completed
      this.journeyIsCompleted()

      //Re-start interval when no nearby drivers are available
      this.startIntervalOnceNoNearbyDrivers()

      //Driver has logged out
      var self = this
      setInterval(() => {
        self.passengerHasLoggedOut()
      }, 1000)

      //Get current fare rate
      this.getCurrentFareRate()
    },

    components: {
      Footer,
      SideNavigation,
      ConfirmationDialogBox,
      RideInfo,
      History
    },

    methods: {
      async getCurrentFareRate() {
        try {
          var request = await PriceService.index()
          var x = (request.data.price/100).toFixed(2)
          this.currentFareRate = x
        } catch (error) {
          console.log(error)
        }
      },
      //Search for nearby places using keywords
      searchForPlaces() {
        var x = this.searchByKeywords.toLowerCase();
        if (x === 'bank') {
          this.selectedSearchPlaces = this.searchBank
          this.searchByKeywordsDialog = true
        } else if (x === 'diner') {
          this.selectedSearchPlaces = this.searchDiner
          this.searchByKeywordsDialog = true
        } else if (x === 'petrol station') {
          this.selectedSearchPlaces = this.searchPetrolStation
          this.searchByKeywordsDialog = true
        } else {
          this.searchByKeywordsDialog = true
          this.noPlaceFound = true
        }
      },
      passengerHasLoggedOut() {
        if (this.$store.state.passengerLoggedOut) {
          this.setPoints = null
          console.log(this.driverLocationInterval, "Kelf")
          clearInterval(this.driverLocationInterval)
          console.log(this.driverLocationInterval, "Don")
          this.$store.dispatch('setPassengerLoggedOut', false) //Remove driver from server and all other passenger client
        }
      },
      startIntervalOnceNoNearbyDrivers() {
        var self = this
        var x = setInterval(() => {
          if (self.$store.state.startThePassengerInterval) {
            self.startTheInterval()
            self.$store.dispatch('setStartThePassengerInterval', false)
          }
        }, 1000)
      },
      stopTheInterval() {
        var self = this
        //Display route to the destination once driver has arrived!
        var x = setInterval(function () {
          if (self.$store.state.stopThePassengerInterval) {
            clearInterval(self.driverLocationInterval) //Clear the interval so it stop showing other driver markers
            self.$store.dispatch('setStopThePassengerInterval', false)
          }
        }, 1000)
      },
      journeyIsCompleted() {
        var self = this
        //Display route to the destination once driver has arrived!
        var x = setInterval(function () {
          if (self.$store.state.journeyCompleted) {
            self.rideActuallyCompleted = false
            getStartPlace = null
            getEndPlace = null
            self.selectedDriverMarker.setMap(null); //stop watching driver location and stop sending to passenger
            self.selectedDriverMarker = null
            self.$store.dispatch('setJourneyCompleted', false) //Start interval function when driver accept request
            self.createGoogleMaps().then(self.initGoogleMaps, self.googleMapsFailedToLoad) //Clear map
            self.startTheInterval() //Save location in available driver server
            self.rideInfo = false
          }
        }, 1000)
      },
      passengerCanceledRequest() {
        var self = this
        //Display route to the destination once driver has arrived!
        var x = setInterval(function () {
          if (self.$store.state.cancelRequest) {
            getStartPlace = null
            getEndPlace = null
            self.selectedDriverMarker.setMap(null); //stop watching driver location and stop sending to passenger
            self.selectedDriverMarker = null
            self.createGoogleMaps().then(self.initGoogleMaps, self.googleMapsFailedToLoad) //Clear map
            self.startTheInterval() //Start getting available drivers from the server
            self.rideInfo = false

            self.$socket.emit('canceledRequest', {
              message: true,
              response: "Passenger has unfortunately canceled the request. Sorry for the inconvenience cause.",
              id: self.driverID
            })
            self.$store.dispatch('setCancelRequest', false) //Start interval function when driver accept request
          }
        }, 1000)
      },
      navigateTo(route) {
        this.$router.push(route)
      },
      startTheInterval() {
        var self = this
        self.getLocations()
        //Get list of available driver locations every 10 seconds
        this.driverLocationInterval = setInterval(function () {
          console.log("Start")
          self.getLocations()
        }, 10000)
      },
      async getLocations() {
        var self = this
        //do a request to the backend for all the driver locations
        var data = (await LocationService.getLocation()).data //always put .data cause thats how axios returns your data      
        //Function is delayed to allow google libraries to be loaded first
        setTimeout(function () {
          for (var i = 0; data[i] != undefined; i++) {
            self.centerMap(data[i].location, data[i].socketID, i);
          }
        }, 1000);
      }, 
      createGoogleMaps() {
        if (!this.$store.state.loadGoogleMapsAPI) {
        this.$store.dispatch('setLoadGoogleMapsAPI', true) //If API has already been used, send next request without utilising the API
          this.leGmap = new Promise((resolve, reject) => {
            let gmap = document.createElement('script')
            gmap.src =
              "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdMfohmlw-A2h2rUNJsbMc7Afvy3m1zt4&libraries=places,geometry"
            gmap.type = 'text/javascript'
            gmap.onload = resolve
            gmap.onerror = reject
            document.body.appendChild(gmap)
          })
          this.$store.dispatch('setGmap', this.leGmap) //If API has already been used, send next request without utilising the API
          return this.leGmap
        } else {
          return this.$store.state.Gmap
        }
      },
      initGoogleMaps() {
        // You could do this as an easier alternative 
        this.vueGMap = new google.maps.Map(document.getElementById('map'), this.globalOptions());
        this.input = document.getElementById('pac-input');
        this.input2 = document.getElementById('pac-input2');
      },
      autoComplete() {
        var self = this;
        this.autocomplete = new google.maps.places.Autocomplete(this.input, this.options);
        this.autocomplete.addListener('place_changed', function () {
          getStartPlace = null
          getStartPlace = this.getPlace()
          self.start = this.getPlace()
          if (getStartPlace != null && getEndPlace != null) {
            self.getRoute()
          }
        });
      },
      autoComplete2() {
        var self = this;
        this.autocomplete2 = new google.maps.places.Autocomplete(this.input2, this.options);
        this.autocomplete2.addListener('place_changed', function () {
          getEndPlace = null
          getEndPlace = this.getPlace()
          self.end = this.getPlace()
          if (getStartPlace != null && getEndPlace != null) {
            self.getRoute()
          }
        });
      },
      centerMap(pos, socketID, i) {
        this.id = socketID
        var marker
        var self = this

        //Check if the driver has his own unique marker
        if (this.setPoints[i] === undefined) {
          marker = new google.maps.Marker({
            position: pos,
            map: self.vueGMap,
            icon: 'https://cdn.discordapp.com/attachments/261814160344481792/478169653538193408/Driver.png',
            id: self.id //Save marker with its unique driver id (socket ID)
          });
          //save the marker inside of an array to keep track of the various driver online
          this.setPoints.push(marker)
        } else {
          //Change the position of the current marker
          this.setPoints[i].setPosition(pos);
        }
        console.log(this.setPoints[0].id)
      },
      googleMapsFailedToLoad() {
        this.vueGMap = 'Error occurred';
      },
      findDriver() {
        if ((getStartPlace != null && getEndPlace != null) || this.searchLocationStatus) {
          this.$store.dispatch('setMenuConfirmation', true)
        } else {
          this.snackbar = true
          this.text = 'Please specify both addresses!'
        }
      },
      getRoute() {
        //Clear the pre-existed marker with old map reference
        this.setPoints = []

        this.vueGMap = new google.maps.Map(document.getElementById('map'), this.globalOptions());
        this.directionsService = new google.maps.DirectionsService()
        this.directionsDisplay = new google.maps.DirectionsRenderer()
        var vm = this
        vm.directionsDisplay.setMap(this.vueGMap)
        vm.directionsService.route({
          origin: {
            lat: getStartPlace.geometry.location.lat(),
            lng: getStartPlace.geometry.location.lng()
          },
          destination: {
            lat: getEndPlace.geometry.location.lat(),
            lng: getEndPlace.geometry.location.lng()
          },
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            vm.directionsDisplay.setDirections(response)
            vm.time = response.routes[0].legs[0].duration.text
            vm.theStartAddress = response.routes[0].legs[0].start_address
            vm.theEndAddress = response.routes[0].legs[0].end_address
            vm.money = ((response.routes[0].legs[0].distance.value / 1000) * vm.currentFareRate).toFixed(2)
            vm.distance = (response.routes[0].legs[0].distance.value / 1000).toFixed(2)
          } else {
            console.log('Directions request failed due to ' + status)
          }
        })
      },
      getRoute2(start, end) {
        //Clear the pre-existed marker with old map reference
        this.setPoints = []

        this.vueGMap = new google.maps.Map(document.getElementById('map'), this.globalOptions());
        this.directionsService = new google.maps.DirectionsService()
        this.directionsDisplay = new google.maps.DirectionsRenderer()
        var vm = this
        vm.directionsDisplay.setMap(this.vueGMap)
        vm.directionsService.route({
          origin: {
            lat: start.lat,
            lng: start.lng
          },
          destination: {
            lat: end[0].lat,
            lng: end[0].lng
          },
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            vm.searchLocationStatus = true
            vm.directionsDisplay.setDirections(response)
            vm.time = response.routes[0].legs[0].duration.text
            vm.theStartAddress = response.routes[0].legs[0].start_address
            vm.theEndAddress = response.routes[0].legs[0].end_address
            vm.money = ((response.routes[0].legs[0].distance.value / 1000) * 1).toFixed(2)
            vm.distance = (response.routes[0].legs[0].distance.value / 1000).toFixed(2)
          } else {
            console.log('Directions request failed due to ' + status)
          }
        })
      },
      getCurrentLocation(des) {
        var self = this
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          self.getRoute2(pos, des)
        });
      }
    },
    beforeDestroy() {
      clearInterval(this.driverLocationInterval)
    }
  }

</script>

<style>
  .start-location {
    margin-top: 58px
  }

  .pac-container {
    z-index: 1;
    width: 100% !important;
    left: 0px !important;
    /* top: 101px !important; */
  }

  input.searchInput:focus {
    outline-width: 0;
  }

  .search-box {
    width: 87%;
    height: 40px;
    padding: 0 0 0 8px;
    margin-right: 4px;
  }

  @media (min-width: 900px) and (max-width: 2000px) {
    .start-location input {
      height: 50px;
    }
  }

</style>
