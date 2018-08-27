<template>
  <v-app>
    <SideNavigation v-if="!$store.state.rideInfo"></SideNavigation>
    <div style="height:100%;width:100%" id="map"></div>
    <!-- <v-btn v-if="!$store.state.MenuConfirmation" color="primary" @click="getTrackingLocation">
      <v-icon class="pr-2">directions_car</v-icon> Find Driver
    </v-btn> -->
    <v-btn v-if="!$store.state.rideInfo && rideInfo" color="primary" @click="$store.dispatch('setRideInfo', true)">
      <v-icon class="pr-2">directions_car</v-icon> View Ride Info
    </v-btn>
    <DriverConfirmationDialogBox v-if="$store.state.DriverMenuConfirmation" :time='this.time' :address='this.address' :money='this.money'
      :passengerID='this.passengerID'></DriverConfirmationDialogBox>
    <RideInfo v-if="$store.state.rideInfo"></RideInfo>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :left="x === 'left'" :multi-line="mode === 'multi-line'" :right="x === 'right'"
      :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn color="red" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  import Footer from './Reuse/Footer.vue'
  import SideNavigation from './Reuse/SideNavigation.vue'
  import DriverConfirmationDialogBox from './Reuse/DriverConfirmationBox.vue'
  import RideInfo from './Reuse/InTransitStatusPage.vue'
  import LocationService from '@/services/LocationService'
  var getStartPlace
  var getEndPlace
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
        rideInfo: false,
        start: null,
        end: null,
        vueGMap: null,
        confirm: true,
        time: 45,
        money: 30,
        address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus magna at mi ultricies, quis vehicula mi pretium.',
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
        passengerID: null
      }

    },
    sockets: {
      //Check if connection has been made
      connect() {
        console.log('Client Socket has been connected')
      },
      //Listen for event on any driver-location messagefrom the server
      sendRequest(data) {
        console.log(data.startLocation, "Baby", data.endLocation)
        this.passengerID = data.passengerId
        this.start = data.startLocation
        this.end = data.endLocation
        this.$store.dispatch('setDriverMenuConfirmation', true)
      }
    },
    mounted() {
      this.$store.dispatch('setTypeOfUser', 'Driver') //Set User as Driver
      this.createGoogleMaps().then(this.initGoogleMaps, this.googleMapsFailedToLoad)
      getStartPlace = null
      getEndPlace = null
      var self = this

      //Check if socket connection has been made
      socketId = this.$socket.id
      console.log('Client socket has been connected Kappa', this.$socket.id)

      //Fired function to update driver location in the server every 10 seconds
      this.updateLocationOnServer()
      
      //check request status before clearing the send driver location interval
      this.checkRequestBeforeClearing()
    },
    components: {
      Footer,
      SideNavigation,
      DriverConfirmationDialogBox,
      RideInfo
    },
    methods: {
      checkRequestBeforeClearing() {
        var self = this
        //check request status before clearing the send driver location interval
        var x = setInterval(function () {
          if (self.$store.state.stopDriverInterval) {
            clearInterval(self.sendCurrentLocationInterval)
            clearInterval(x)
            self.getTrackingLocation()
            self.getRoute()
            self.rideInfo = true
          }
        }, 1000)
      },
      updateLocationOnServer() {
        var self = this
        //Get location of driver every 10 seconds
        this.sendCurrentLocationInterval = setInterval(function () {
          navigator.geolocation.getCurrentPosition(success);
          console.log("Fucktion fired!");
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
        return new Promise((resolve, reject) => {
          let gmap = document.createElement('script')
          gmap.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdMfohmlw-A2h2rUNJsbMc7Afvy3m1zt4&libraries=places"
          gmap.type = 'text/javascript'
          gmap.onload = resolve
          gmap.onerror = reject
          document.body.appendChild(gmap)
        })
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
          if (getStartPlace != null && getEndPlace != null) {
            self.getRoute()
          }
        });
      },
      googleMapsFailedToLoad() {
        this.vueGMap = 'Error occurred';
      },
      findDriver() {
        if (getStartPlace != null && getEndPlace != null) {
          this.$store.dispatch('setMenuConfirmation', true)
        } else {
          this.snackbar = true
        }
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
      getTrackingLocation() {
        console.log(point, '1 ')
        console.log(this.start.geometry, '2 ')
        // console.log(getStartPlace, '3 ')
        var watchID;
        var geoLoc;
        var marker;
        var self = this;

        function showLocation(position) {
          var loc = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);

          console.log(loc, "Kappa Prideeee");
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

        if (navigator.geolocation) {
          geoLoc = navigator.geolocation;
          watchID = geoLoc.watchPosition(showLocation, errorHandler);
        } else {
          alert("Sorry, browser does not support geolocation!");
        }
      }
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
