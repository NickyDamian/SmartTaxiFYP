<template>
  <v-app>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click.native="dialog = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Ride Info</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card dark color="primary">
      <v-flex class='pt-3'>
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
        <v-flex class='pt-1 pb-1'>
          <v-icon>aspect_ratio</v-icon>
          <label>Don 6969</label>
          <v-icon class="pl-3">directions_car</v-icon>
          <label>Bob's Burger</label>
        </v-flex>
        <v-flex class='pb-3'>
          <label>Smart Taxi Driver</label>
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
    <v-btn flat dark>
      <v-icon class="pr-2">not_interested</v-icon> Cancel Request
    </v-btn>
    </v-card>
  </v-app>
</template>

<script>


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
