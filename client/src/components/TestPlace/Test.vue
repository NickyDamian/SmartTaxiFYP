<template>
  <v-app>

    <!-- <v-toolbar color="primary" dark fixed>
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Smart Taxi</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>History</v-btn>
        <v-btn flat>Search</v-btn>
        <v-btn flat>Feedback</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" absolute temporary class="hidden-md-and-up">
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title @click="navigateTo({name: 'login'})">Donny Boy</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" @click="navigateTo({name: item.link})">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-layout class="pt-5">
      <v-flex class="pt-2">
        <v-layout row>
          <v-toolbar dense absolute floating class="auto-complete-field" color="secondary" xs12 md12 lg12>
            <v-btn icon>
              <v-icon color="red">my_location</v-icon>
            </v-btn>
            <v-card id="auto-complete-card" xs12 md12 lg12>
              <GmapAutocomplete @place_changed="setStartPlace" placeholder="Starting Location" id="auto-complete"></GmapAutocomplete>
            </v-card>
          </v-toolbar>
          <v-toolbar dense absolute floating class="auto-complete-field2" color="secondary" xs12 md12 lg12>
            <v-btn icon>
              <v-icon color="light-blue lighten-3">my_location</v-icon>
            </v-btn>
            <v-card id="auto-complete-card" xs12 md12 lg12>
              <GmapAutocomplete @place_changed="setEndPlace" placeholder="I'm going to..." id="auto-complete"></GmapAutocomplete>
            </v-card>
          </v-toolbar>
        </v-layout>

        <GmapMap id="maps" :options="{streetViewControl: false}" :center="center" :zoom="15" map-type-id="terrain">
          <GmapMarker :key="index" v-for="(marker, index) in markers" :position="marker.position" :clickable="false" :draggable="true"
            @click="center=marker.position" />
          <GmapMarker v-for="(marker, index) in markers" :key="index" :position="marker.position" />
          <GmapMarker v-if="this.StartPlace" label="★" :position="{
          lat: this.StartPlace.geometry.location.lat(),
          lng: this.StartPlace.geometry.location.lng(),
            }" />
          <GmapMarker v-if="this.EndPlace" label="★" :position="{
          lat: this.EndPlace.geometry.location.lat(),
          lng: this.EndPlace.geometry.location.lng(),
            }" />
        </GmapMap>

      </v-flex>
    </v-layout>

    <Footer></Footer> -->

  </v-app>
</template>

<script>
  // import Footer from '../Reuse/Footer.vue'
  // export default {
  //   data() {
  //     return {
  //       address: '',
  //       markers: [],
  //       StartPlace: null,
  //       EndPlace: null,
  //       center: {
  //         lat: 3.2581661,
  //         lng: 101.6925354
  //       },
  //       // markers: [{
  //       //     position: {
  //       //       lat: 3.2581661,
  //       //       lng: 101.6925354
  //       //     }
  //       //   },
  //       //   {
  //       //     position: {
  //       //       lat: 3.257999,
  //       //       lng: 101.694679
  //       //     }
  //       //   }
  //       // ],

  //       drawer: false,
  //       items: [{
  //           title: 'History',
  //           icon: 'history',
  //           link: 'history'
  //         },
  //         {
  //           title: 'Search',
  //           icon: 'search',
  //           link: 'search'
  //         },
  //         {
  //           title: 'Feedback',
  //           icon: 'feedback',
  //           link: 'test'
  //         },
  //         {
  //           title: 'Sign Out',
  //           icon: 'exit_to_app',
  //           link: 'login'
  //         }
  //       ],
  //       right: null
  //     }
  //   },
  //   components: {
  //     Footer
  //   },
  //   methods: {
  //     navigateTo(route) {
  //       this.$router.push(route)
  //     },
  //     //   setDescription(description) {
  //     //     this.description = description;
  //     //   },
  //     setStartPlace(place) {
  //       this.StartPlace = place
  //       this.center.lat = this.StartPlace.geometry.location.lat()
  //       this.center.lng = this.StartPlace.geometry.location.lng()
  //     },
  //     setEndPlace(place) {
  //       this.EndPlace = place
  //     }
  //     // usePlace(place) {
  //     //   if (this.place) {
  //     //     this.markers.push({
  //     //       position: {
  //     //         lat: this.place.geometry.location.lat(),
  //     //         lng: this.place.geometry.location.lng(),
  //     //       }
  //     //     })
  //     //     this.place = null;
  //     //   }
  //     // }
  //   }
  // }

</script>

<style>
  /* #maps {
    width: 100%;
    height: 94%;
  }

  #auto-complete {
    width: 100% !important;
    height: 33px !important;
    padding-left: 5px;
  }

  #auto-complete-card {
    width: 260px !important;
    height: 33px !important;
  }

  .auto-complete-field {
    margin-top: 60px !important;
    margin-left: 2%;
    width: 85%;
  }

  .auto-complete-field2 {
    margin-top: 107px !important;
    margin-left: 2%;
    width: 85%;
  }

  @media (min-width: 900px) and (max-width: 2000px) {
    #auto-complete {
      width: 1359px !important;
    }
    #maps {
      height: 95.9%;
    }
    #auto-complete-card {
      width: 1358px !important;
    }
    .auto-complete-field {
      margin-top: 70px !important;
      margin-left: .5%;
      width: 75%;
    }
    .auto-complete-field2 {
      margin-top: 116px !important;
      margin-left: .5%;
      width: 75%;
    }
  } */

</style>
