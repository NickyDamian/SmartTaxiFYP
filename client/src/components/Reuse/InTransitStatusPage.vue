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
          <img src="https://png.icons8.com/color/1600/person" alt="avatar">
        </v-avatar>
      </v-flex>
      <div class='riderInfo'>
        <v-flex class='pt-2'>
          <v-icon>person_pin</v-icon>
          <label>{{clientName}}</label>
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
          <label>{{distance}} km</label>
        </v-flex>
        <v-flex class='pb-3'>
          <v-rating readonly half-increments v-model="displayRating" color="yellow darken-3" background-color="grey darken-1"
            empty-icon="$vuetify.icons.ratingFull" full-increments></v-rating>
        </v-flex>
      </div>
    </v-card>
    <v-card>
      <v-flex class="pt-3 address-section">
        <v-icon color='red' class="time-icon">home</v-icon>
        <label>Start</label>
      </v-flex>
      <v-flex class="pb-2 address">
        <label>{{startAddress}}</label>
      </v-flex>
      <v-flex class="pt-2 address-section">
        <v-icon color='cyan' class="time-icon">home</v-icon>
        <label>End</label>
      </v-flex>
      <v-flex class="pb-3 address">
        <label>{{endAddress}}</label>
      </v-flex>
      <v-flex v-if='$store.state.typeOfUser == "Driver"' class="commentSection">
        <v-textarea outline class="pl-3 pr-3" rows="3" solo label="No comments to show..." readonly v-model='this.comment'></v-textarea>
      </v-flex>
      <v-flex v-if='$store.state.typeOfUser == "Passenger"' class="commentSection">
        <v-textarea outline class="pl-3 pr-3" rows="3" solo label="No comments to show..." readonly v-model='$store.state.commentForPassenger'></v-textarea>
      </v-flex>
      <v-flex class="pb-2">
        <v-icon color="primary">attach_money</v-icon>
        <label class="money">MYR {{money}}</label>
      </v-flex>
    </v-card>
    <v-card color="primary">
      <v-btn v-if='$store.state.typeOfUser == "Passenger" && !$store.state.displayJourneyCompletedForPassenger' flat
        large dark block @click="dialog = true">
        <v-icon class="pr-2">not_interested</v-icon> Cancel Request
      </v-btn>
      <v-btn v-if='$store.state.typeOfUser == "Driver" && driverReached' flat large dark block @click="driverHasReached(), notifyPassengerDialog=true, driverReached = false, beginJourney = true">
        <v-icon class="pr-2">directions_car</v-icon> Driver Has Reached
      </v-btn>
      <v-btn v-if='$store.state.typeOfUser == "Driver" && beginJourney' flat large dark block @click="beginJourney = false, completeJourney = true, $store.dispatch('setRideInfo', false), beginTheJourney(), getCurrentLocation()">
        <v-icon class="pr-2">beenhere</v-icon> Begin Journey
      </v-btn>
      <v-btn v-if='completeJourney || $store.state.displayJourneyCompletedForPassenger' flat large dark block @click="completeJourney = false, driverReached = true, checkIfJourneyCompleted()">
        <v-icon class="pr-2">beenhere</v-icon> Journey Completed
      </v-btn>
    </v-card>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>

        <v-card-text>
          Driver is already on its way to pick you up! If you do choose to cancel, please note that this will directly
          affect your
          rating.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" flat="flat" @click="dialog = false">
            Lulz Joke
          </v-btn>

          <v-btn color="green darken-1" flat="flat" @click="dialog = false, passengerCanceledRequest(), $store.dispatch('setRideInfo', false), $store.dispatch('setHideTheTopIcons', false)">
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
          It seems that your passenger still hasn`t arrive. Would you like to wait for another 3 mins or cancel the
          request.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="cancelPassengerRequest = false, resendDriverHasReachedRequest('Wait')">
            Wait
          </v-btn>

          <v-btn color="green darken-1" flat="flat" @click="cancelPassengerRequest = false, resendDriverHasReachedRequest(), driverReached= true, beginJourney= false, 
          $store.dispatch('setHideTheTopIcons', false), $store.dispatch('setRideInfo', false)">
            Cancel Request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="feedbackDialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Ride Over?
        </v-card-title>

        <v-card-text>
          Please take a moment and provide us your feedback on your ride. Thank you!
        </v-card-text>

        <v-rating v-model="rating" color="yellow darken-3" background-color="grey darken-1" empty-icon="$vuetify.icons.ratingFull"
          full-increments></v-rating>

        <v-card-actions>
          <v-textarea outline rows="3" solo label="Additional comments..." v-model="feedback"></v-textarea>
        </v-card-actions>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="feedbackDialog = false, journeyCompleted(), submitFeedback(), saveHistory(), saveDriverRate(), 
          $store.dispatch('setRideInfo', false), $store.dispatch('setHideTheTopIcons', false), sendEmailReceipt()">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="passengerCanceledFeedbackDialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Ride was canceled?
        </v-card-title>

        <v-card-text>
          Will you like to notify other drivers of your experience?
        </v-card-text>

        <v-rating v-model="rating" color="yellow darken-3" background-color="grey darken-1" empty-icon="$vuetify.icons.ratingFull"
          half-increments></v-rating>

        <v-card-actions>
          <v-textarea outline rows="3" solo label="Additional comments..." v-model="feedback"></v-textarea>
        </v-card-actions>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="passengerCanceledFeedbackDialog = false, $store.dispatch('setRideInfo', false), $store.dispatch('setHideTheTopIcons', false)">
            Skip
          </v-btn>
          <v-btn color="primary" flat @click="passengerCanceledFeedbackDialog = false, submitFeedback(), $store.dispatch('setRideInfo', false), $store.dispatch('setHideTheTopIcons', false)">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="rideActuallyCompletedDialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Please wait!
        </v-card-title>

        <v-card-text>
          It seems that your journey is still in progress. Please wait until the driver has reached your destination
          before ending the request!
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="rideActuallyCompletedDialog = false">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import FeedbackService from '@/services/FeedbackService'
  import HistoryService from '@/services/HistoryService'
  import CancelRate from '@/services/CancelRateService'
  import PickupService from '@/services/PickupService'
  import EmailService from '@/services/EmailService'
  export default {
    data() {
      return {
        displayRating: 0,
        passengerCanceledFeedbackDialog: false,
        rideActuallyCompletedDialog: false,
        rideComplete: this.rideActuallyCompleted,
        rating: 5,
        feedback: '',
        dialog: false,
        driverReached: true,
        notifyPassengerDialog: false,
        cancelPassengerRequest: false,
        beginJourney: false,
        completeJourney: false,
        feedbackDialog: false,
        theIntervalWhenDriverArrives: null,
        historyRequest: null
      }
    },
    sockets: {
      canceledRequest(data) {
        this.driverReached = true
        this.beginJourney = false
        clearInterval(this.theIntervalWhenDriverArrives)
      },
      rideActuallyCompleted(data) {
        this.rideComplete = data.message
      },
      preMatureCanceledRequest(data) {
        this.$store.dispatch('setJourneyCompleted', true)
        this.passengerCanceledFeedbackDialog = true
        this.driverReached = true
        this.beginJourney = false
        clearInterval(this.theIntervalWhenDriverArrives)
      },
      sendRequest(data) {
        var x = data.rideRequest[7] //passenger email
        this.getHistory("Driver", x)
      },
      requestStatus(data) {
        if (data.message == 'Accepted') {
          var x = data.driverEmailAddress //driver email
          this.getHistory("Passenger", x)
        } else {
          console.log("Declined")
        }
      }
    },
    props: [
      'passengerID',
      'passengerEmailAddress',
      'driverID',
      'driverEmailAddress',
      'comment',
      'rideActuallyCompleted',
      'startAddress',
      'endAddress',
      'clientName',
      'distance',
      'money'
    ],
    methods: {
      async sendEmailReceipt(position) {
        try {
          var receipt = await EmailService.sendEmail({
            clientEmail: this.$store.state.clientEmailAddress,
            // clientEmail: 'nickydamian25@gmail.com',
            clientName: this.$store.state.clientName,
            startAddress: this.startAddress,
            endAddress: this.endAddress,
            price: this.money,
          })
        } catch (error) {
          console.log(error)
        }
      },
      getCurrentLocation() {
        var self = this
        //Get user's current postition
        navigator.geolocation.getCurrentPosition(function (position) {
          var currentUserPos = new google.maps.LatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          self.savePickup(currentUserPos);
        });
      },
      async savePickup(position) {
        try {
          var pickups = await PickupService.savePickups({
            email: this.$store.state.clientEmailAddress,
            pickup: [{
              location: position,
              price: this.money
            }]
          })
        } catch (error) {
          console.log(error)
        }
      },
      async getHistory(user, emailAddress) {
        if (user === 'Driver') {
          try {
            this.historyRequest = await FeedbackService.getDriverFeedback({
              passengerID: emailAddress
            })
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            this.historyRequest = await FeedbackService.getPassengerFeedback({
              driverID: emailAddress
            })
          } catch (error) {
            console.log(error)
          }
        }
        console.log(this.historyRequest)
        if (this.historyRequest != null) {
          var sum = 0
          for (var i = 0; i < this.historyRequest.data.retrieved.feedbacks.length; i++) {
            sum = (sum + parseInt(this.historyRequest.data.retrieved.feedbacks[i].rating))
          }
          var average = (sum / this.historyRequest.data.retrieved.feedbacks.length)
          this.displayRating = average
        } else {
          console.log("GG")
        }
      },
      async saveDriverRate() {
        if (this.$store.state.typeOfUser == 'Driver') {
          try {
            var request = await CancelRate.saveRate({
              email: this.$store.state.clientEmailAddress,
              totalRides: (parseInt(this.$store.state.driverRate.totalRides) + 1),
              cancelled: parseInt(this.$store.state.driverRate.cancelled)
            })
          } catch (error) {
            console.log(error)
          }
        }
      },
      async saveHistory() {
        try {
          var historyRequest = await HistoryService.saveHistory({
            email: this.$store.state.clientEmailAddress,
            rideInfo: [{
              startAddress: this.startAddress,
              endAddress: this.endAddress,
              rating: this.rating,
              feedback: this.feedback,
              price: this.money
            }]
          })
        } catch (error) {
          this.error = error.response.data.error
        }
      },
      async submitFeedback() {
        if (this.$store.state.typeOfUser == 'Passenger') {
          try {
            const response = await FeedbackService.savePassengerFeedback({
              driverID: this.driverEmailAddress,
              feedbacks: [{
                rating: this.rating,
                comment: this.feedback
              }]
            })
          } catch (error) {
            this.error = error.response.data.error
          }
        } else {
          try {
            const response = await FeedbackService.saveDriverFeedback({
              passengerID: this.passengerEmailAddress,
              feedbacks: [{
                rating: this.rating,
                comment: this.feedback
              }]
            })
          } catch (error) {
            this.error = error.response.data.error
          }
          if (this.rating < 3) {
            try {
              const response = await FeedbackService.saveBadRequest({
                passengerID: this.passengerEmailAddress,
                feedbacks: [{
                  driverName: this.$store.state.clientName,
                  comment: this.feedback
                }]
              })
            } catch (error) {
              this.error = error.response.data.error
            }
          }
        }
        this.rating = 0
        this.feedback = ''
      },
      driverNoticeInterval() {
        var self = this
        this.theIntervalWhenDriverArrives = setInterval(() => {
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
        } else {
          clearInterval(this.theIntervalWhenDriverArrives)
          this.$store.dispatch('setCancelRequest', true)
        }
      },
      beginTheJourney() {
        clearInterval(this.theIntervalWhenDriverArrives)
        this.$store.dispatch('setDisplayRouteForJourney', true)
        this.$socket.emit('theJourneyHasBegun', {
          message: true,
          passengerId: this.passengerID
        })
      },
      cancelBooking() {
        this.$store.dispatch('setCancelRequest', true)
        this.$store.dispatch('setCommentForPassenger', null)
      },
      passengerCanceledRequest() {
        this.$store.dispatch('setJourneyCompleted', true)
        this.$store.dispatch('setCommentForPassenger', null)
        this.$socket.emit('preMatureCanceledRequest', {
          message: true,
          driverId: this.driverID
        })
      },
      checkIfJourneyCompleted() {
        if (this.$store.state.typeOfUser === 'Passenger' && !this.rideComplete) {
          this.rideActuallyCompletedDialog = true
        } else {
          this.feedbackDialog = true
        }
      },
      journeyCompleted() {
        this.rideComplete = false
        this.$socket.emit('rideActuallyCompleted', {
          message: true,
          passengerId: this.passengerID
        })
        this.$store.dispatch('setDisplayJourneyCompletedForPassenger', false)
        this.$store.dispatch('setJourneyCompleted', true)
        this.$store.dispatch('setCommentForPassenger', null)
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
    font-weight: 600;
    font-size: 18px;
  }

  .address {
    font-weight: 400;
    font-size: 15px;
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
