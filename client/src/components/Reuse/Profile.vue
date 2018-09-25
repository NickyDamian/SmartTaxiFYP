<template>
    <v-app>
        <v-toolbar color=primary dark>
      <v-btn icon @click="$store.dispatch('setSubmenuPage', null)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Profile</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card class="mb-2" height="auto">
        <v-flex class='pt-4'>
        <v-avatar :size="130" color="grey lighten-4">
          <img src="http://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png"
            alt="avatar">
        </v-avatar>
      </v-flex>
          <v-form ref="form1">
            <v-container grid-list-xl>
              <v-layout v-bind="binding">
                <v-flex>
                  <v-text-field readonly prepend-icon="person" label="First Name"
                    v-model="firstName" color="accent"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field readonly prepend-icon="person" label="Last Name"
                    v-model="lastName" color="accent"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout v-bind="binding">
                <v-flex>
                  <v-text-field 
                    readonly prepend-icon="phone" label="Phone Number" v-model="phoneNumber" color="accent"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field 
                    readonly label="Date of Birth" prepend-icon="cake" v-model="dateOfBirth" color="accent"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout v-bind="binding">
                <v-flex xs12>
                  <v-text-field v-model="select" readonly disable label="Type of user" prepend-icon="person"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-rating readonly half-increments v-model="displayRating" color="yellow darken-3" background-color="grey darken-1"
            empty-icon="$vuetify.icons.ratingFull" full-increments></v-rating>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
    </v-app>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import FeedbackService from '@/services/FeedbackService'
export default {
 data() {
      return {
        displayRating: 3,
        select: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        emailAddress: ''
      }
    },
    mounted() {
        this.findDetails()
        this.getRating()
    },
    computed: {
      binding() {
        const binding = {}

        if (this.$vuetify.breakpoint.mdAndDown) binding.column = true

        return binding
      }
    },
    methods: {
        async findDetails() {
            try {
          var request = await AuthenticationService.findDetails({
            email: this.$store.state.clientEmailAddress
          })
            this.firstName = request.data.details.firstname
            this.lastName = request.data.details.lastname
            this.dateOfBirth = request.data.details.dob
            this.phoneNumber = request.data.details.phonenumber
            this.select = request.data.details.typeUser
        } catch (error) {
          this.error = error
        }
        },
        async getRating() {
        if (this.$store.state.typeOfUser === 'Passenger') {
          try {
            this.historyRequest = await FeedbackService.getDriverFeedback({
              passengerID: this.$store.state.clientEmailAddress
            })
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            this.historyRequest = await FeedbackService.getPassengerFeedback({
              driverID: this.$store.state.clientEmailAddress
            })
          } catch (error) {
            console.log(error)
          }
        }
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
      }
    }
}
</script>

<style>

</style>
