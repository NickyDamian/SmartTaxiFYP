<template>
  <div>
    <div v-if="$store.state.DriverMenuConfirmation">
      <v-card class="borderRadiusDialog">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="declineRequest()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Ride Request</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-flex class="pt-3">
          <v-btn color="grey lighten-5">
            <v-icon>credit_card</v-icon>
          </v-btn>
          <v-btn color="grey lighten-5" class="option-button" @click.native="getBadRequests(),passengerBadRequestDialog = true">
            <v-icon>linear_scale</v-icon>
          </v-btn>
          <v-btn dark color="secondary" @click.native="confirmationBoxDisplay(), show=true, acceptRequest()">Accept</v-btn>
        </v-flex>
        <v-flex class="pt-2 pb-2 time-label">
          <label>Time Estimation</label>
          <v-icon class="time-icon">access_time</v-icon>
          <v-label>{{time}}</v-label>
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
      <v-dialog v-model="passengerBadRequestDialog" fullscreen persistent>
        <v-card v-if="badrequests != null">
          <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
            Bad Requests?
          </v-card-title>
          <v-list two-line>
            <template v-for="(badrequest, index) in badrequests">
              <v-list-tile :key="index" avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ badrequest.driverName }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ badrequest.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < badrequests.length" :key="`divider-${index}`"></v-divider>
            </template>
            <v-divider></v-divider>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="passengerBadRequestDialog = false">
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-if="badrequests === null">
          <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
            Bad Requests?
          </v-card-title>
          <v-card-text>
          It seems that this passenger does not have any bad requests!
        </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="passengerBadRequestDialog = false">
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="driverRateDialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Smart Taxi
        </v-card-title>

        <v-card-text>
          Unfortunately your cancellation rate is above 10%. We cannot allow your cancellation rate to be avove 10 % of your total reques.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="driverRateDialog = false">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
  </div>
</template>

<script>
  import LocationService from '@/services/LocationService'
  import FeedbackService from '@/services/FeedbackService'
  import CancelRate from '@/services/CancelRateService'
  export default {
    data() {
      return {
        driverRateDialog: false,
        badrequests: null,
        passengerBadRequestDialog: false,
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
      'passengerID',
      'passengerEmailAddress',
      'driverRate'
    ],
    mounted() {
      // console.log(this.data[0][1])
      // console.log(this.passengerId)
      console.log("Its been a kappa pride kinda day")
      this.getBadRequests()
    },
    methods: {
      async getBadRequests() {
        try {
          const badRating = await FeedbackService.getBadRequest({
            passengerID: this.passengerEmailAddress
          })
          this.badrequests = badRating.data.rating.feedbacks
        } catch (error) {
          this.error = error.response.data.error
        }
      },
      confirmationBoxDisplay() {
        this.$store.dispatch('setDriverMenuConfirmation', false)
      },
      acceptRequest() {
        this.$socket.emit('requestStatusToAll', {
          driverId: this.$socket.id,
        })

        this.$socket.emit('requestStatus', {
          message: "Accepted",
          passengerId: this.passengerId,
          driverId: this.$socket.id,
          driverName: this.$store.state.clientName,
          driverEmailAddress: this.$store.state.clientEmailAddress
        })
        this.$store.dispatch('setDriverRate', this.driverRate) //Stop interval function when driver accept request 
        this.$store.dispatch('setDriverIntervalStatus', true) //Stop interval function when driver accept request       
        this.deleteDriverFromServer() //Delete driver location from available driver collection
      },
      declineRequest() {
          var x = (parseInt(this.driverRate.cancelled) / parseInt(this.driverRate.totalRides) * 100)
          if (x > 10) {
            this.driverRateDialog = true
          } else {
            this.confirmationBoxDisplay()
            this.updateDriverRate()
            this.$socket.emit('requestStatus', {
          message: "Declined",
          passengerId: this.passengerId
        })
          }
        
      },
      async updateDriverRate() {
        try {
          var addOne = (parseInt(this.driverRate.cancelled) + 1)
          var request = await CancelRate.saveRate({
              email: this.$store.state.clientEmailAddress,
              totalRides: (parseInt(this.driverRate.totalRides) + 1),
              cancelled: addOne
            })
        } catch (error) {
          console.log(error)
        }
      },
      async deleteDriverFromServer() {
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
    margin-left: -20px !important;
    font-weight: 600;
    font-size: 18px;
  }

  .address {
    font-weight: 400;
    font-size: 15px;
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
