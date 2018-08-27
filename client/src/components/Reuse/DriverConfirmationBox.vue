<template>
  <div>
    <div v-if="$store.state.DriverMenuConfirmation">
      <v-card class="borderRadiusDialog">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="confirmationBoxDisplay(),declineRequest()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Ride Request</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-flex class="pt-3">
          <v-btn color="grey lighten-5">
            <v-icon>credit_card</v-icon>
          </v-btn>
          <v-btn color="grey lighten-5" class="option-button">
            <v-icon>linear_scale</v-icon>
          </v-btn>
          <v-btn dark color="secondary" @click.native="confirmationBoxDisplay(), show=true, acceptRequest()">Accept</v-btn>
        </v-flex>
        <v-flex class="pt-2 pb-2 time-label">
          <label>Time Estimation</label>
          <v-icon class="time-icon">access_time</v-icon>
          <v-label>{{time}} minutes</v-label>
          <v-progress-linear color="success" height="5" value="70"></v-progress-linear>
        </v-flex>
        <v-flex class="address-section">
          <v-icon class="time-icon">home</v-icon>
          <label>Address</label>
        </v-flex>
        <v-flex class="pb-3 address">
          <label>{{address}}</label>
        </v-flex>
        <v-divider></v-divider>
        <v-flex class="pt-2 pb-2">
          <v-icon class="money-icon" color="primary">attach_money</v-icon>
          <label class="money">MYR {{money}}</label>
        </v-flex>
      </v-card>
    </div>
  </div>
</template>

<script>
import LocationService from '@/services/LocationService'
  export default {
    data() {
      return {
        dialog: true,
        notifications: false,
        sound: true,
        widgets: false,
        passengerId: this.passengerID
      }
    },
    props: [
      'time',
      'address',
      'money',
      'passengerID'
    ],
    mounted() {
      // console.log(this.data[0][1])
      // console.log(this.passengerId)
    },
    methods: {
      confirmationBoxDisplay() {
        this.$store.dispatch('setDriverMenuConfirmation', false)
      },
      acceptRequest() {
        this.$socket.emit('requestStatusToAll', {
          driverId: this.$socket.id,
        })
        
        this.$socket.emit('requestStatus', {
          message: "Accepted",
          passengerId: this.passengerId
        })   
        
        this.$store.dispatch('setDriverIntervalStatus', true) //Stop interval function when driver accept request       
        this.deleteDriverFromServer() //Delete driver location from available driver collection
      },
      declineRequest() {
        this.$socket.emit('requestStatus', {
          message: "Declined",
          passengerId: this.passengerId
        })
      },
      async deleteDriverFromServer () {
        try {
          const response = await LocationService.deleteLocation({
            socketID: this.$socket.id
          })
        } catch (error) {
          this.error = error.response.data.error
        }
      },
      getCurrentPosition() {
        var self = this
        //Get user's current postition
        navigator.geolocation.getCurrentPosition(function (position) {
          var currentUserPos = new google.maps.LatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log(position.coords.latitude, position.coords.longitude, "Kappa Pride Baby");
        });
      }
    }
  }

</script>

<style>
  .borderRadiusDialog {
    width: 100%;
    bottom: 0%;
    position: absolute;
    z-index: 1;
  }

  .option-button {
    margin-left: -11px;
  }

  .time-label {
    margin-left: -1px !important;
    font-weight: 600;
    font-size: 18px;
  }

  .time-icon {
    padding-left: 35px !important;
  }

  .address-section {
    margin-left: -120px !important;
    font-weight: 600;
    font-size: 18px;
  }

  .address {
    font-weight: 300;
    font-size: 15px;
    text-align: justify !important;
    padding: 0 45px;
  }

  .money {
    font-weight: 600;
    font-size: 18px;
  }

  .v-progress-circular {
    margin: 1rem
  }

</style>
