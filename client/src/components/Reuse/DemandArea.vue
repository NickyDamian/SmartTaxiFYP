<template>
  <v-app>
    <v-layout>
      <v-flex>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-btn icon dark @click.native="$store.dispatch('setSubmenuPage', null)">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Demand Area</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-card>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-data-table :headers="headers" :items="areas" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td>{{ props.item.frequency }}</td>
              </template>
              <template slot="no-data">
                <v-alert :value="true" color="red" icon="warning">
                  Sorry, nothing to display here :(
                </v-alert>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import LocationService from '@/services/LocationService'
  export default {
    data() {
      return {
        requestInterval: null,
        headers: [{
            text: 'Demand Area',
            align: 'left',
            value: 'name'
          },
          {
            text: 'Frequency',
            align: 'center',
            value: 'calories'
          }
        ],
        areas: [{
            value: false,
            name: 'Asia Pacific University',
            frequency: 0
          },
          {
            value: false,
            name: 'Maybank TPM',
            frequency: 0
          },
          {
            value: false,
            name: 'LRT Alam Sutera',
            frequency: 0
          }
        ],
        responses: null
      }
    },
    mounted() {
      var self = this
      self.getLocations()
    },
    methods: {
      async getLocations() {
        var self = this
        var apu = new google.maps.LatLng({
            lat: 3.056027,
            lng: 101.700023
          });
        var maybank = new google.maps.LatLng({
            lat: 3.048174,
            lng: 101.689093
          });
        var alamsutera = new google.maps.LatLng({
            lat: 3.054944,
            lng: 101.656457
        });
        //do a request to the backend for all the driver locations
        var data = (await LocationService.getLocation()).data //always put .data cause thats how axios returns your data      
        //Function is delayed to allow google libraries to be loaded first
        var apuArea = []
        var maybankArea = []
        var alamsuteraArea = []
        for (var i = 0; data[i] != undefined; i++) {
          var driverPosition =  new google.maps.LatLng({
            lat: data[i].location.lat,
            lng: data[i].location.lng
        });
          var apuRadius = (google.maps.geometry.spherical.computeDistanceBetween(apu, driverPosition) / 1000).toFixed(2)
          if(apuRadius <= 1.00) {
            apuArea.push("apuRadius")
          }

          var maybankRadius = (google.maps.geometry.spherical.computeDistanceBetween(maybank, driverPosition) / 1000).toFixed(2)
          if(maybankRadius <= 1.00) {
            maybankArea.push(maybankRadius)
          }

          var alamsuteraRadius = (google.maps.geometry.spherical.computeDistanceBetween(alamsutera, driverPosition) / 1000).toFixed(2)
          if(alamsuteraRadius <= 1.00) {
            alamsuteraArea.push(alamsuteraRadius)
          }
          //Push the apu radius in an array if less than 1km. Check lenght of array for frequency
          }
          if(apuArea.length != undefined) {
            this.areas[0].frequency = apuArea.length
          }
          if(maybankArea.length != undefined) {
            this.areas[1].frequency = maybankArea.length
          }
          if(alamsuteraArea.length != undefined) {
            this.areas[2].frequency = alamsuteraArea.length
          }
      }
    },
    beforeDestroy() {
      clearInterval(this.requestInterval)
    }  
  }

</script>

<style>
  .location {
    font-weight: 600;
    font-size: 15px
  }

  .money {
    text-align: right;
    padding-right: 10px;
  }

  .commentSection {
    margin-bottom: -20px
  }

  .locationName {
    font-weight: 400;
    font-size: 14px;
    padding: 0 10px;
    text-align: justify !important;
  }

</style>
