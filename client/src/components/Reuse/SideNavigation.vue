<template>
  <v-layout>
    <v-toolbar color="primary" dark fixed>
      <v-toolbar-side-icon v-if='!$store.state.hideTheTopIcons' @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Smart Taxi</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon v-if="$store.state.typeOfUser === 'Passenger' && !$store.state.hideTheTopIcons" @click="searchPlaces()">
        <v-icon>directions</v-icon>
      </v-btn>
      <v-btn icon @click="callEmergencyContacts()">
        <v-icon>call</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="http://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title @click="navigateTo({name: 'login'})">{{this.$store.state.clientName}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" @click="loggedout(item.link), changePage(item.link)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white; font-size: 18px" class="primary" primary-title>
          Access Denied
        </v-card-title>

        <v-card-text>
          This function is only offered to driver's of Smart Taxi. Sorry for the inconvinience.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Vue from 'vue'
  export default {
    data() {
      return {
        dialog: false,
        drawer: false,
        searchBox: false,
        items: [{
            title: 'History',
            icon: 'history',
            link: 'history'
          },
          {
            title: 'Profile',
            icon: 'person',
            link: 'profile'
          },
          {
            title: 'Demand Area',
            icon: 'drive_eta',
            link: 'demandArea'
          },
          {
            title: 'Pick Ups',
            icon: 'pin_drop',
            link: 'pickups'
          },
          {
            title: 'Sign Out',
            icon: 'exit_to_app',
            link: 'login'
          }
        ]
      }
    },
    methods: {
      searchPlaces() {
        if (this.searchBox === false) {
          this.$store.dispatch('setSearchForPlaces', true)
          this.searchBox = true
        } else {
          this.$store.dispatch('setSearchForPlaces', false)
          this.searchBox = false
        }
      },
      loggedout(item) {
        if (item === 'login') {
          if (this.$store.state.typeOfUser === 'Driver') {
            this.$store.dispatch('setDriverLoggedOut', true) //Remove driver from server and all other passenger client\
            this.$router.push({name: 'login'})
          } else {
            this.$store.dispatch('setPassengerLoggedOut', true)
            this.$router.push({name: 'login'})
          }
        }
      },
      changePage(item) {
        if (item != 'login') {
          if((item === 'demandArea' && this.$store.state.typeOfUser === 'Passenger') || (item === 'pickups' && this.$store.state.typeOfUser === 'Passenger')){
            this.dialog = true
          } else {
            this.$store.dispatch('setSubmenuPage', item)
          }
        }
      },
      callEmergencyContacts() {
        // Vue.cordova.CordovaCall.sendCall('Kelf');
      }
    }
  }

</script>

<style>


</style>
