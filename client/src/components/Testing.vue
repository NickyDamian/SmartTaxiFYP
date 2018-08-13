<template>
  <v-app>
    <SideNavigation></SideNavigation>
    <div>
      <!-- <img class="logo" src="..\assets\img\Driver.png" style="margin-top:70px;"> -->
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
    <div style="height:100%;width:100%" id="map"></div>
    <v-btn v-if="!$store.state.MenuConfirmation" color="primary" @click="getTrackingLocation">
      <v-icon class="pr-2">directions_car</v-icon> Find Driver
    </v-btn>
    <ConfirmationDialogBox v-if="$store.state.MenuConfirmation" :time='this.time' :address='this.address' :money='this.money'></ConfirmationDialogBox>
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
  import ConfirmationDialogBox from './Reuse/Confirmation-Box.vue'
  import io from 'socket.io-client'
  var getStartPlace
  var getEndPlace
  var lat1 = 3.0580092
  var lng1 = 101.7011474
  export default {
    data() {
      return {
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
        text: 'Please specify both addresses!'
      }

    },
    mounted() {
      this.createGoogleMaps().then(this.initGoogleMaps, this.googleMapsFailedToLoad)
      getStartPlace = null
      getEndPlace = null
      var socket = io.connect('http://localhost:8081') //Making connection to socket on server

      navigator.geolocation.getCurrentPosition(success);
      function success(position) {
        var point = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);
          console.log(position.coords.latitude,position.coords.longitude)

        //Emit Events //First parameter is the name of the message  //Second parameter is the actual value
        socket.emit('driver-location', {
          message: point
        })
      }
    },
    components: {
      Footer,
      SideNavigation,
      ConfirmationDialogBox
    },
    methods: {
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
        this.vueGMap = new google.maps.Map(document.getElementById('map'), this.globalOptions());
        this.directionsService = new google.maps.DirectionsService()
        this.directionsDisplay = new google.maps.DirectionsRenderer()
        this.directionsDisplay.setMap(this.vueGMap)
        var vm = this
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
          } else {
            console.log('Directions request failed due to ' + status)
          }
        })
      },
      getCurrentLocation() {

      },
      // getTrackingLocation1() {
      //   var self = this
      //   var marker = null
      //   var current
      //   navigator.geolocation.getCurrentPosition(function (position) {
      //     console.log("kappa");

      //     var point = new google.maps.LatLng(position.coords.latitude,
      //       position.coords.longitude);

      //     console.log(position.coords.latitude, "Kappa Prideeee",
      //       position.coords.longitude);


      //     if (marker && point != current) {
      //       // Marker already created - Move it
      //       marker.setPosition(point);

      //     } else if (marker === null) {
      //       // Marker does not exist - Create it
      //       marker = new google.maps.Marker({
      //         position: point,
      //         map: self.vueGMap
      //       });
      //       current = point
      //     }
      //     // Center the map on the new position
      //     self.vueGMap.setCenter(point);
      //   });
      // },
      // test() {
      //   this.getTrackingLocation()
      //   setInterval(() => {
      //     this.getTrackingLocation()
      //   }, 10000)
      // },
      getTrackingLocation() {
        var watchID;
        var geoLoc;
        var marker;
        var self = this;

        function showLocation(position) {
          var point = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);

          console.log(position.coords.latitude, "Kappa Prideeee",
            position.coords.longitude);


          if (marker) {
            // Marker already created - Move it
            marker.setPosition(point);

          } else {
            // var icon = {
            //   url: "..\assets\img\Driver.png"
            // }
            // Marker does not exist - Create it
            marker = new google.maps.Marker({
              position: point,
              map: self.vueGMap,
              icon: 'https://cdn.discordapp.com/attachments/261814160344481792/478169653538193408/Driver.png'
            });
          }
          // Center the map on the new position
          self.vueGMap.setCenter(point);
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
