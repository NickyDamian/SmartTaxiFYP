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
          <v-btn color="grey lighten-5" class="option-button">
            <v-icon>linear_scale</v-icon>
          </v-btn>
          <v-btn dark color="secondary" @click.native="confirmationBoxDisplay, show=true, setProgress()">Book</v-btn>
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
        <v-flex v-if="show" class="pt-2 pb-2">
          <v-icon class="money-icon" color="primary">directions_car</v-icon>
          <label class="money">Finding you a driver</label>
          <v-progress-circular :rotate="360" :size="55" :width="8" :value="value" color="primary">
            {{ value }}
          </v-progress-circular>
        </v-flex>
      </v-card>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialog: true,
        notifications: false,
        sound: true,
        widgets: false,
        interval: {},
        value: 0,
        show: false
      }
    },
    props: [
      'time',
      'address',
      'money'
    ],
    methods: {
      confirmationBoxDisplay() {
        this.$store.dispatch('setMenuConfirmation', false)
      },
      setProgress() {
        this.interval = setInterval(() => {
          if (this.value === 100) {
            return (this.value = 0)
          }
          this.value += 10
        }, 1000)
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
