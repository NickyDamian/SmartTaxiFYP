<template>
  <div id="app">
    <!-- <div id="gmap-container"></div>
    <GmapAutocomplete @place_changed="setStartPlace" placeholder="Starting Location" id="auto-complete"></GmapAutocomplete>
    <GmapAutocomplete @place_changed="setEndPlace" placeholder="I'm going to..." id="auto-complete"></GmapAutocomplete>
    <v-btn block @click="getRoute">Click Me</v-btn>
    <v-btn block @click="clearMap">Clear Me</v-btn> -->
  </div>
</template>

<script>
  // export default {
  //   data() {
  // 	return {
  //     value: false,
  //     vueGMap: null,
  //     StartPlace: null,
  //     EndPlace: null,
  //     // Basically, making an anon function so that Vue 
  //     // doesn't try to access google.maps until it's actually required
  //     globalOptions: () => ({
  //       zoom: 15,
  //       center: {lat: 3.055952, lng: 101.699916},
  //       mapTypeControl: true,
  //       mapTypeControlOptions: {
  //         style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
  //         mapTypeIds: ['roadmap', 'terrain', 'satellite']
  //       }
  //     })
  //   }
  // },
  // methods: {
  //     createGoogleMaps () {
  //       return new Promise((resolve, reject) => {
  //         let gmap = document.createElement('script')
  //         gmap.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdMfohmlw-A2h2rUNJsbMc7Afvy3m1zt4"
  //         gmap.type = 'text/javascript'
  //         gmap.onload = resolve
  //         gmap.onerror = reject
  //         document.body.appendChild(gmap)
  //       })
  //     },
  //   initGoogleMaps() {
	// 		// You could do this as an easier alternative 
  //     const localOptions = {
  //       zoom: 4,
  //       center: {lat: -33, lng: 151},
  //       mapTypeControl: true,
  //       mapTypeControlOptions: {
  //         style: () => window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
  //         mapTypeIds: ['roadmap', 'terrain']
  //       }
  //     } 
  //     this.vueGMap = new google.maps.Map(document.getElementById('gmap-container'), this.globalOptions());
      
  //     // console.log(this.vueGMap);
  //   },
  //   googleMapsFailedToLoad() {
  //   	this.vueGMap = 'Error occurred';
  //   },
  //   clearMap(){
  //       this.createGoogleMaps().then(this.initGoogleMaps);       
  //   },
  //   getRoute () {
  //     this.directionsService = new google.maps.DirectionsService()
  //     this.directionsDisplay = new google.maps.DirectionsRenderer()
  //     this.directionsDisplay.setMap(this.vueGMap)
  //     var vm = this
  //     vm.directionsService.route({
  //       origin: {lat: this.StartPlace.geometry.location.lat(), lng:this.StartPlace.geometry.location.lng()},
  //       destination: {lat: this.EndPlace.geometry.location.lat(), lng:  this.EndPlace.geometry.location.lng()},
  //       travelMode: 'DRIVING'
  //     }, function (response, status) {
  //       if (status === 'OK') {
  //         vm.directionsDisplay.setDirections(response)
  //       } else {
  //         console.log('Directions request failed due to ' + status)
  //       }
  //     })
  //   },
  //   setStartPlace(place) {
  //       this.StartPlace = place
  //       console.log(place)
  //     },
  //   setEndPlace(place) {
  //       this.EndPlace = place
  //     }  
  // },

  // mounted() {
  //   this.createGoogleMaps().then(this.initGoogleMaps,this.googleMapsFailedToLoad);
  // }
  // }

</script>

<style>
/* #gmap-container {
  height: 500px;
  width: 700px;
  margin: 0 auto;
}
*, *::after, *::before {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

.search-location {
  display: block;
  width: 60vw;
  margin: 0 auto;
  margin-top: 5vw;
  font-size: 20px;
  font-weight: 400;
  outline: none;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 10px;
} */
</style>
