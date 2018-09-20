<template>
  <v-app>
    <SideNavigation v-if="!$store.state.rideInfo && $store.state.submenuPage === null"></SideNavigation>
    <div v-show="$store.state.submenuPage === null" style="height:100%;width:100%" id="map"></div>
    <!-- <v-btn v-if="!$store.state.MenuConfirmation" color="primary" @click="getTrackingLocation">
      <v-icon class="pr-2">directions_car</v-icon> Find Driver
    </v-btn> -->
    <v-btn v-if="(!$store.state.rideInfo && rideInfo) && $store.state.submenuPage === null" color="primary" @click="$store.dispatch('setRideInfo', true)">
      <v-icon class="pr-2">directions_car</v-icon> View Ride Info
    </v-btn>
    <DriverConfirmationDialogBox v-if="$store.state.DriverMenuConfirmation && $store.state.submenuPage === null" :time='this.time' :address='this.theEndAddress'
      :money='this.money' :passengerID='this.passengerID' :passengerEmailAddress='this.passengerEmailAddress' :driverRate='this.driverRate'></DriverConfirmationDialogBox>
    <RideInfo v-show="$store.state.rideInfo && $store.state.submenuPage === null" :passengerID='this.passengerID' :clientName='this.passengerName' :comment='this.comment'
      :startAddress='this.theStartAddress' :endAddress='this.theEndAddress' :distance='this.distance' :money="this.money" :passengerEmailAddress='this.passengerEmailAddress'></RideInfo>
      <History v-if="$store.state.submenuPage === 'history'"></History>
      <DemandArea v-if="$store.state.submenuPage === 'demandArea'"></DemandArea>
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
          {{this.passengerMessage}}
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
  </v-app>
</template>

<script>
  import History from './Reuse/History.vue'
  import DemandArea from './Reuse/DemandArea.vue'
  import Footer from './Reuse/Footer.vue'
  import SideNavigation from './Reuse/SideNavigation.vue'
  import DriverConfirmationDialogBox from './Reuse/DriverConfirmationBox.vue'
  import RideInfo from './Reuse/InTransitStatusPage.vue'
  import LocationService from '@/services/LocationService'
  import CancelRate from '@/services/CancelRateService'
  var lat1 = 3.0580092
  var lng1 = 101.7011474
  var point = {
    lat: 3.1973376,
    lng: 101.76102399999999
  }
  var socketId
  export default {
    data() {
      return {
        driverRate: null,
        passengerEmailAddress: null,
        comment: '',
        notifyPassengerDialog: false,
        passengerMessage: null,
        watchID: null,
        rideInfo: false,
        start: null,
        end: null,
        vueGMap: null,
        confirm: true,
        time: null,
        money: null,
        distance: null,
        theStartAddress: null,
        theEndAddress: null,
        options: {
          componentRestrictions: {
            country: "my"
          }
        },
        globalOptions: () => ({
          zoom: 16,
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
        text: 'Please specify both addresses!',
        sendCurrentLocationInterval: null,
        checkIntervalRequest: false,
        passengerID: null,
        passengerName: null,
      }

    },
    sockets: {
      //Check if connection has been made
      connect() {
        console.log('Client Socket has been connected')
      },
      //Listen for event on any driver-location messagefrom the server
      sendRequest(data) {
        this.getDriverRate()
        this.time = data.rideRequest[0]
        this.money = data.rideRequest[1]
        this.theStartAddress = data.rideRequest[2]
        this.theEndAddress = data.rideRequest[3]
        this.passengerName = data.rideRequest[4]
        this.distance = data.rideRequest[5]
        this.money = data.rideRequest[6]
        this.passengerEmailAddress = data.rideRequest[7]
        this.passengerID = data.passengerId
        this.start = data.startLocation
        this.end = data.endLocation
        this.comment = data.comment
        this.$store.dispatch('setDriverMenuConfirmation', true)
      },
      canceledRequest(data) {
        this.passengerMessage = data.response
        this.notifyPassengerDialog = data.message
        this.rideInfo = false
        navigator.geolocation.clearWatch(this.watchID);
        this.createGoogleMaps().then(this.initGoogleMaps, this.googleMapsFailedToLoad)
        //Start interval for getting driver location
        this.updateLocationOnServer()
      }
    },
    mounted() {
      this.$store.dispatch('setTypeOfUser', 'Driver') //Set User as Driver
      this.createGoogleMaps().then(this.initGoogleMaps, this.googleMapsFailedToLoad)
      var self = this

      //Check if socket connection has been made
      socketId = this.$socket.id
      console.log('Client socket has been connected Kappa', this.$socket.id)

      //Fired function to update driver location in the server every 10 seconds
      this.updateLocationOnServer()

      //check request status before clearing the send driver location interval
      this.checkRequestBeforeClearing()

      //Display route to the passenger destination once driver has arrive to the starting location
      this.showRouteToTheDestination()

      //Cancel the whole request if passenger does not show up.
      this.driverCanceledRequest()

      //Journey Completed
      this.journeyIsCompleted()

      //Driver has logged out
      var self = this
      setInterval(() => {
        self.prepareForLoggedOut()
      }, 1000)
    },
    components: {
      Footer,
      SideNavigation,
      DriverConfirmationDialogBox,
      RideInfo,
      History,
      DemandArea
    },
    methods: {
      async getDriverRate() {
        try {
          var request = await CancelRate.getRate({
              email: this.$store.state.clientEmailAddress
            })
        } catch (error) {
          console.log(error)
        }
        this.driverRate = request.data
        console.log(this.driverRate, "Kappa Pride OOOOOOOO")
      },
      prepareForLoggedOut() {
        if (this.$store.state.driverLoggedOut) {
          this.$store.dispatch('setDriverLoggedOut', false)
          this.driverHasLoggedOut()
          clearInterval(this.sendCurrentLocationInterval)
          this.$socket.emit('requestStatusToAll', {
            driverId: this.$socket.id,
          })
          console.log("Kappa")
        }
      },
      async driverHasLoggedOut() {
        this.$store.dispatch('setDriverLoggedOut', false) //Remove driver from server and all other passenger client
        try {
          const response = await LocationService.deleteLocation({
            socketID: this.$socket.id
          })
        } catch (error) {
          this.error = error.response.data.error
        }
        console.log("Kappa Pride")
      },
      journeyIsCompleted() {
        var self = this
        //Display route to the destination once driver has arrived!
        var x = setInterval(function () {
          if (self.$store.state.journeyCompleted) {
            self.$store.dispatch('setJourneyCompleted', false) //Start interval function when driver accept request
            navigator.geolocation.clearWatch(self.watchID); //stop watching driver location and stop sending to passenger
            self.createGoogleMaps().then(self.initGoogleMaps, self.googleMapsFailedToLoad) //Clear map
            self.updateLocationOnServer() //Save location in available driver server
            self.rideInfo = false
          }
        }, 1000)
      },
      driverCanceledRequest() {
        var self = this
        //Display route to the destination once driver has arrived!
        var x = setInterval(function () {
          if (self.$store.state.cancelRequest) {
            self.$store.dispatch('setCancelRequest', false) //Start interval function when driver accept request
            navigator.geolocation.clearWatch(self.watchID); //stop watching driver location and stop sending to passenger
            self.createGoogleMaps().then(self.initGoogleMaps, self.googleMapsFailedToLoad) //Clear map
            self.updateLocationOnServer() //Save location in available driver server
            self.rideInfo = false

            self.$socket.emit('canceledRequest', {
              message: true,
              response: "Driver has canceled your request since you were unable to arrive to the starting location in time. Sorry for the inconvinience cause!",
              id: self.passengerID
            })
          }
        }, 1000)
      },
      showRouteToTheDestination() {
        var self = this
        //Display route to the destination once driver has arrived!
        var x = setInterval(function () {
          if (self.$store.state.displayRouteForJourney) {
            self.$store.dispatch('setDisplayRouteForJourney', false) //Start interval function when driver accept request 
            self.getRoute2()
            self.getTrackingLocation("clear")
          }
        }, 1000)
      },
      checkRequestBeforeClearing() {
        var self = this
        //check request status before clearing the send driver location interval
        var x = setInterval(function () {
          if (self.$store.state.stopDriverInterval) {
            clearInterval(self.sendCurrentLocationInterval)
            self.$store.dispatch('setDriverIntervalStatus', false) //Sets condition to false after setting the route to the passenger. Avoids running the function twice 
            self.getTrackingLocation()
            self.getRoute()
            self.rideInfo = true
          }
        }, 1000)
      },
      updateLocationOnServer() {
        var self = this
        navigator.geolocation.getCurrentPosition(success); //Fire function before 10sec interval
        //Get location of driver every 10 seconds
        this.sendCurrentLocationInterval = setInterval(function () {
          navigator.geolocation.getCurrentPosition(success);
          console.log("Function fired!");
        }, 10000)

        function success(position) {
          point = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          //Save location of driver into the database once location of driver is found
          self.saveDriverLocation(socketId, point)
        }
      },
      async saveDriverLocation(socketID, location) {
        try {
          const response = await LocationService.saveLocation({
            socketID: socketID,
            location: location
          })
        } catch (error) {
          this.error = error.response.data.error
        }
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
      },
      googleMapsFailedToLoad() {
        this.vueGMap = 'Error occurred';
      },
      getRoute() {
        // console.log(point, '1 ', point.lat(), '2 ', point.lng())
        this.vueGMap = new google.maps.Map(document.getElementById('map'), this.globalOptions());
        this.directionsService = new google.maps.DirectionsService()
        this.directionsDisplay = new google.maps.DirectionsRenderer()
        this.directionsDisplay.setMap(this.vueGMap)
        var vm = this
        vm.directionsService.route({
          origin: {
            lat: point.lat,
            lng: point.lng
          },
          destination: {
            lat: this.start.geometry.location.lat,
            lng: this.start.geometry.location.lng
          },
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            vm.directionsDisplay.setDirections(response)
          } else {
            console.log('Directions request failed due to ' + status)
          }
        })
      },
      getRoute2(start, end) {
        // console.log(point, '1 ', point.lat(), '2 ', point.lng())
        this.vueGMap = new google.maps.Map(document.getElementById('map'), this.globalOptions());
        this.directionsService = new google.maps.DirectionsService()
        this.directionsDisplay = new google.maps.DirectionsRenderer()
        this.directionsDisplay.setMap(this.vueGMap)
        var vm = this
        vm.directionsService.route({
          origin: {
            lat: this.start.geometry.location.lat,
            lng: this.start.geometry.location.lng
          },
          destination: {
            lat: this.end.geometry.location.lat,
            lng: this.end.geometry.location.lng
          },
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            vm.directionsDisplay.setDirections(response)
          } else {
            console.log('Directions request failed due to ' + status)
          }
        })
      },
      getTrackingLocation(clear) {
        var geoLoc;
        var marker;
        var self = this;

        function showLocation(position) {
          var loc = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);

          console.log("Hapi Boi")
          self.$socket.emit('sendTheSelectedDriverLocation', {
            location: loc,
            passengerId: self.passengerID
          })

          if (marker) {
            // Marker already created - Move it
            marker.setPosition(loc);

          } else {
            // Marker does not exist - Create it
            marker = new google.maps.Marker({
              position: loc,
              map: self.vueGMap,
              icon: 'https://cdn.discordapp.com/attachments/261814160344481792/478169653538193408/Driver.png'
            });
          }
          // Center the map on the new position
          self.vueGMap.setCenter(loc);
        }

        function errorHandler(err) {
          if (err.code == 1) {
            alert("Error: Access is denied!");
          } else if (err.code == 2) {
            alert("Error: Position is unavailable!");
          }
        }
        if (clear === "clear") { //Clear marker then rewatch position to the passenger destination
          navigator.geolocation.clearWatch(this.watchID);
          if (navigator.geolocation) {
            geoLoc = navigator.geolocation;
            this.watchID = geoLoc.watchPosition(showLocation, errorHandler);
          } else {
            alert("Sorry, browser does not support geolocation!");
          }
        } else {
          if (navigator.geolocation) {
            geoLoc = navigator.geolocation;
            this.watchID = geoLoc.watchPosition(showLocation, errorHandler);
          } else {
            alert("Sorry, browser does not support geolocation!");
          }
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.sendCurrentLocationInterval)
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
