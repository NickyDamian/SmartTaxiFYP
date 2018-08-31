<template>
  <div>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="$store.dispatch('setRideInfo', false)">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Ride Info</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card dark color="primary">
      <v-flex class='pt-2'>
        <v-avatar :size="135" color="grey lighten-4">
          <img src="https://scontent.fkul8-1.fna.fbcdn.net/v/t1.0-9/944741_549526581802281_2055920157_n.jpg?_nc_cat=0&oh=22b26b54bf0a1894b2720bf4ce713ee0&oe=5C07A9E8"
            alt="avatar">
        </v-avatar>
      </v-flex>
      <div class='riderInfo'>
        <v-flex class='pt-2'>
          <v-icon>person_pin</v-icon>
          <label>Don Darudei</label>
        </v-flex>
        <v-flex class='pt-1 pb-1' v-if='$store.state.typeOfUser == "Passenger"'>
          <v-icon>aspect_ratio</v-icon>
          <label>Don 6969</label>
          <v-icon class="pl-3">directions_car</v-icon>
          <label>Bob's Burger</label>
        </v-flex>
        <v-flex class='pt-1 pb-1' v-if='$store.state.typeOfUser == "Driver"'>
          <v-icon>add</v-icon>
          <label>Smart Ride</label>
          <v-icon class="pl-3">near_me</v-icon>
          <label>14 km</label>
        </v-flex>
        <v-flex class='pb-3'>
          <label>Rating Issa Here</label>
        </v-flex>
      </div>
    </v-card>
    <v-card>
      <v-flex class="pt-3 address-section">
        <v-icon color='red' class="time-icon">home</v-icon>
        <label>Start</label>
      </v-flex>
      <v-flex class="pb-2 address">
        <label>Apu New Campus</label>
      </v-flex>
      <v-flex class="pt-2 address-section">
        <v-icon color='cyan' class="time-icon">home</v-icon>
        <label>End</label>
      </v-flex>
      <v-flex class="pb-3 address">
        <label>Rumah Donny Boy</label>
      </v-flex>
      <v-flex class="commentSection">
        <v-textarea outline class="pl-3 pr-3" rows="3" solo label="Outline textarea" readonly value="At the front entrance with a loser kid named Kelf"></v-textarea>
      </v-flex>
      <v-flex class="pb-2">
        <v-icon color="primary">attach_money</v-icon>
        <label class="money">MYR 30</label>
      </v-flex>
    </v-card>
    <v-card color="primary">
      <v-btn v-if='$store.state.typeOfUser == "Passenger" && !$store.state.displayJourneyCompletedForPassenger' flat large dark block @click="dialog = true">
        <v-icon class="pr-2">not_interested</v-icon> Cancel Request
      </v-btn>
      <v-btn v-if='$store.state.typeOfUser == "Driver" && driverReached' flat large dark block @click="driverHasReached(), notifyPassengerDialog=true, driverReached = false, beginJourney = true">
        <v-icon class="pr-2">directions_car</v-icon> Driver Has Reached
      </v-btn>
      <v-btn v-if='$store.state.typeOfUser == "Driver" && beginJourney' flat large dark block @click="beginJourney = false, completeJourney = true, $store.dispatch('setRideInfo', false), beginTheJourney()">
        <v-icon class="pr-2">beenhere</v-icon> Begin Journey
      </v-btn>
      <v-btn v-if='completeJourney || $store.state.displayJourneyCompletedForPassenger' flat large dark block @click="completeJourney = false, driverReached = true">
        <v-icon class="pr-2">beenhere</v-icon> Journey Completed
      </v-btn>
    </v-card>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>

        <v-card-text>
          Driver is already on its way to pick you up! If you do choose to cancel, please note that this will directly affect your
          rating.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" flat="flat" @click="dialog = false">
            Lulz Joke
          </v-btn>

          <v-btn color="green darken-1" flat="flat" @click="dialog = false, cancelBooking(), $store.dispatch('setRideInfo', false)">
            I'm Sure
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="notifyPassengerDialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Notifying Passenger
        </v-card-title>

        <v-card-text>
          We will notify your passenger that you have safely arrived to the starting location!
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
    <v-dialog v-model="cancelPassengerRequest" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Passenger hasn`t arrive?
        </v-card-title>

        <v-card-text>
          It seems that your passenger still hasn`t arrive. Would you like to wait for another 3 mins or cancel the request.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="cancelPassengerRequest = false, resendDriverHasReachedRequest('Wait')">
            Wait
          </v-btn>

          <v-btn color="green darken-1" flat="flat" @click="cancelPassengerRequest = false, resendDriverHasReachedRequest(), driverReached= true, beginJourney= false">
            Cancel Request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
        driverReached: true,
        notifyPassengerDialog: false,
        cancelPassengerRequest: false,
        beginJourney: false,
        completeJourney: false,
        theIntervalWhenDriverArrives: null
      }
    },
    sockets: {
      canceledRequest(data) {
        this.driverReached= true
        this.beginJourney= false
      }
    },
    props: [
      'passengerID',
      'driverID'
    ],
    methods: {
      driverNoticeInterval () {
        var self = this
        this.theIntervalWhenDriverArrives = setInterval(() => {
          console.log(self.theIntervalWhenDriverArrives, "Kappa Pride Don")
          self.cancelPassengerRequest = true
        }, 20000)
      },
      driverHasReached() {
        var self = this
        this.$socket.emit('notifyDriverHasReached', {
          message: true,
          response: "Driver has arrived to your location. Driver will wait up to 3 mins for your arrival. Thank you!",
          passengerId: this.passengerID
        })
        this.driverNoticeInterval()
      },
      resendDriverHasReachedRequest(message) {
        if (message === 'Wait') {
          this.$socket.emit('notifyDriverHasReached', {
            message: true,
            response: "This is a reminder notice. Please note that the driver has agreed to wait another 3 mins! Please hurry! Thank you!",
            passengerId: this.passengerID
          })
        }
        else {
          clearInterval(this.theIntervalWhenDriverArrives)
          this.$store.dispatch('setCancelRequest', true)
        }
      },
      beginTheJourney() {
        this.$store.dispatch('setDisplayJourneyCompletedForPassenger', true) //Passenger cannot cancel booking once in the driver's car
        clearInterval(this.theIntervalWhenDriverArrives)
        this.$store.dispatch('setDisplayRouteForJourney', true)
        this.$socket.emit('theJourneyHasBegun', {
            message: true,
            passengerId: this.passengerID
        })
      },
      cancelBooking() {
        this.$store.dispatch('setCancelRequest', true)
      }
    }
  }

</script>


<style>
  .riderInfo {
    font-family: Lato;
    font-size: 16px;
    font-weight: 400;
  }

  .address-section {
    margin-left: -120px !important;
    font-weight: 600;
    font-size: 18px;
  }

  .address {
    font-weight: 400;
    font-size: 15px;
    text-align: justify !important;
    padding: 0 52px;
  }

  .money {
    font-weight: 600;
    font-size: 18px;
  }

  .commentArea {
    font-weight: 400;
    font-size: 15px;
    text-align: left !important;
  }

  .commentSection {
    margin-bottom: -20px
  }

</style>
