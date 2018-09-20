<template>
  <v-app>
    <v-layout>
      <v-flex>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-btn icon dark @click.native="$store.dispatch('setSubmenuPage', null)">
            <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>History</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-card>
        <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="responses != null" v-for="(response, index) in responses" :key='index'>
          <v-divider light class="pt-2"></v-divider>
          <v-flex class="pt-1 money">
            <v-icon color="primary">attach_money</v-icon>
            <label style="font-size: 15px; font-weight: 600;">MYR {{response.price}}</label>
          </v-flex>
          <v-divider light></v-divider>
          <v-flex class="pt-1 pr-5 pb-1 location">
            <v-icon color='red' class="time-icon">home</v-icon>
            <label>Start Address</label>
          </v-flex>
          <label class="locationName">{{response.startAddress}}</label>
          <v-flex class="pt-2 pr-5 pb-1 location">
            <v-icon color='cyan' class="time-icon">home</v-icon>
            <label>End Address</label>
          </v-flex>
          <label class="locationName">{{response.endAddress}}</label>
          <v-flex class="pt-3 commentSection">
            <v-textarea outline class="pl-3 pr-3" rows="2" solo label="No feedbacks to show..." readonly :value="response.feedback"></v-textarea>
          </v-flex>
        </v-card>
        </v-flex>
        <v-dialog v-model="dialog" width="500" persistent>
          <v-card>
            <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
              Smart Taxi
            </v-card-title>

            <v-card-text>
              We are sorry to infom you that there are no ride history under your profile!
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="dialog = false, $store.dispatch('setSubmenuPage', null)">
                Go Back
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  import HistoryService from '@/services/HistoryService'
  export default {
    data() {
      return {
        responses: null,
        dialog: false
      }
    },
    mounted() {
      this.getHistory()
    },
    methods: {
      async getHistory() {
        try {
          var historyRequest = await HistoryService.getHistory({
            email: this.$store.state.clientEmailAddress
          })
        } catch (error) {
          this.error = error.response.data.error
        }
        if (historyRequest == null) {
          this.dialog = true
        } else {
          this.responses = historyRequest.data.histories.rideInfo
        }
      }
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
