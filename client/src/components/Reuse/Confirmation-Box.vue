<template>
  <div>
    <div v-if="$store.state.MenuConfirmation">
      <v-card class="borderRadiusDialog">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="confirmationBoxDisplay">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Find Driver</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-flex class="pt-3">
          <v-btn color="grey lighten-5">
            <v-icon>credit_card</v-icon>
          </v-btn>
          <v-btn color="grey lighten-5" class="option-button" @click="commentDialog = true">
            <v-icon>add_circle_outline</v-icon>
          </v-btn>
          <v-btn dark color="secondary" @click.native="confirmationBoxDisplay, show=true, setProgress()">Book</v-btn>
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
          <label>{{endAddress}}</label>
        </v-flex>
        <v-divider></v-divider>
        <v-flex class="pt-2 pb-2">
          <v-icon class="money-icon" color="primary">attach_money</v-icon>
          <label class="money">MYR {{money}}</label>
        </v-flex>
        <v-flex v-if="show" class="pt-2 pb-2">
          <v-icon class="money-icon" color="primary">directions_car</v-icon>
          <label class="money">Finding you a driver</label>
          <v-progress-circular :rotate="360" :size="55" :width="8" :value="value" color="primary">
            {{ value }}
          </v-progress-circular>
        </v-flex>
      </v-card>
      <v-dialog v-model="commentDialog" width="500" persistent ref="commentDialog">
        <v-card>
          <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
            Smart Taxi
          </v-card-title>

          <v-card-actions class="comment-section">
            <v-textarea :rules="rules.commentRules" outline rows="3" solo label="Note to driver..." v-model="comment"></v-textarea>
          </v-card-actions>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="commentDialog = false, comment=''">
              Cancel
            </v-btn>

            <v-btn color="green darken-1" flat="flat" @click="commentDialog = false, passengerComment()">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="noNearDriversAvailable" width="500" persistent>
        <v-card>
          <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
            No Nearby Drivers!
          </v-card-title>

          <v-card-text>
            We are sorry to inform you that we are unable to find any nearby drivers for you at this time.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="noNearDriversAvailable = false, confirmationBoxDisplay()">
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        x: 1, //Value to disable click button once book button has been clicked
        noNearDriversAvailable: false,
        comment: '',
        commentDialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        interval: {},
        value: 0,
        show: false,
        dataOnDriverLocations: this.data,
        radiusOfDriverDistance: [],
        startLocation: this.start,
        endLocation: this.end,
        rules: {
          commentRules: [
            (v) => v.length <= 120 || 'Please ensure it is not more than 120 characters'
          ]
        }
      }
    },
    props: [
      'time',
      'startAddress',
      'endAddress',
      'money',
      'data',
      'start',
      'end',
      'distance'
    ],
    mounted() {
      this.$store.dispatch('setCommentForPassenger', null)
    },
    methods: {
      passengerComment() {
        this.$store.dispatch('setCommentForPassenger', this.comment)
      },
      submit() {
        if (this.$refs.commentDialog.validate()) {
          this.commentDialog = false
        }
      },
      confirmationBoxDisplay() {
        this.$store.dispatch('setMenuConfirmation', false)
      },
      setProgress() {
        var i = 1
        if (this.x === 1) {
          this.x++
          this.interval = setInterval(() => {
            if (this.value === 100) {
              if (i === 1) {
                this.getCurrentPosition()
                i++
              }
              return (this.value = 0);
            }
            this.value += 10
          }, 500)
        }
      },
      findDriverWithShortestDistance() {
        var minimum = 1000 //Base number as 1000 since radius won't cover pass that (Not suitable for real production)
        var shortestDistanceDriver
        var self = this
        //Iterate through each array ITEM in the array
        for (var i = 0; i < this.radiusOfDriverDistance.length; ++i) {
          //Iterate through each item in the sub-array
          for (var j = 0; j < this.radiusOfDriverDistance[i].length; ++j) {
            //Compare the radius. If smaller, save as the new minimum
            minimum = Math.min(minimum, this.radiusOfDriverDistance[i][0])
            //Save the driver object with the shortest radius distance
            if (minimum == this.radiusOfDriverDistance[i][0]) {
              shortestDistanceDriver = this.radiusOfDriverDistance[i]
            }
          }
        }
        console.log(minimum, shortestDistanceDriver)
        if (minimum < 150 || minimum === undefined) {
          //Emit Events //First parameter is the name of the message  //Second parameter is the actual value
          this.$socket.emit('sendRequest', {
            rideRequest: [this.time, this.money, this.startAddress, this.endAddress, "Nicky", this.distance, this.money],
            driverId: shortestDistanceDriver[1],
            passengerId: this.$socket.id,
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            comment: this.comment
          })
        } else {
          this.noNearDriversAvailable = true
          this.$store.dispatch('setStartThePassengerInterval', true)
        }

      },
      compareDistance(currentUserPos) {
        //Calculate radius between all available drivers
        for (var i = 0; this.dataOnDriverLocations[i] != undefined; i++) {

          //Compare the driver postion with the user's location and save in array
          //Compute the distance between two points only accept LatLng objects and returns the value in meters //divide by 1000 to get in km
          //Calculated by the default radius of the earth, so distance will be 0.1% off
          var radius = (google.maps.geometry.spherical.computeDistanceBetween(currentUserPos, this.dataOnDriverLocations[
            i].position) / 1000).toFixed(2)
          this.radiusOfDriverDistance.push([radius, this.dataOnDriverLocations[i].id])
        }
        console.log(this.radiusOfDriverDistance, "No Kappa Pride Baby");
        this.findDriverWithShortestDistance()
      },
      getCurrentPosition() {
        this.$store.dispatch('setStopThePassengerInterval', true)
        var self = this
        //Get user's current postition
        navigator.geolocation.getCurrentPosition(function (position) {
          var currentUserPos = new google.maps.LatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          self.compareDistance(currentUserPos);
        });
      }
    },
    beforeDestroy() {
      clearInterval(this.interval)
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

  .comment-section {
    padding-top: 18px;
    margin-bottom: -10px
  }

</style>
