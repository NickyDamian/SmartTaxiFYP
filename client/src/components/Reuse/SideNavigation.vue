<template>
  <v-layout>
    <v-toolbar color="primary" dark fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Smart Taxi</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="searchPlaces()">
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
            <img src="https://scontent.fkul8-1.fna.fbcdn.net/v/t1.0-9/944741_549526581802281_2055920157_n.jpg?_nc_cat=0&oh=22b26b54bf0a1894b2720bf4ce713ee0&oe=5C07A9E8">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title @click="navigateTo({name: 'login'})">Donny Boy</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" @click="navigateTo({name: item.link}), loggedout(item.link)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script>
import Vue from 'vue'
  export default {
    data() {
      return {
        drawer: false,
        searchBox: false,
        items: [{
            title: 'History',
            icon: 'history',
            link: 'history'
          },
          {
            title: 'Search',
            icon: 'search',
            link: 'search'
          },
          {
            title: 'Feedback',
            icon: 'feedback',
            link: 'test'
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
      navigateTo(route) {
        this.$router.push(route)
      },
      loggedout(item) {
        if (item === 'login') {
          if (this.$store.state.typeOfUser === 'Driver') {
            this.$store.dispatch('setDriverLoggedOut', true) //Remove driver from server and all other passenger client
          } else {
            this.$store.dispatch('setPassengerLoggedOut', true)
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
