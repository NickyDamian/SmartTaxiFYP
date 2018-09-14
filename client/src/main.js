// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import colors from 'vuetify/es5/util/colors'
import store from './store/store'
import VueSocketIo from 'vue-socket.io-extended'
import io from 'socket.io-client'
import VueCordova from 'vue-cordova'

//Enables vue to use with Cordova plugins
Vue.use(VueCordova)

//Making socket connection with the server
Vue.use(VueSocketIo, io('http://localhost:8081'))

//The google maps api
// import * as VueGoogleMaps from "vue2-google-maps";

//Font icons for the login page alone
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faEnvelope, faLock)
Vue.component('font-awesome-icon', FontAwesomeIcon)

//Vuetify
Vue.use(Vuetify, {
  theme: {
    primary: colors.green.darken1,
    secondary: colors.green.darken2,
    accent: '#8c9eff',
    error: '#b71c1c'
  }
 });

// //Google maps api key
//  Vue.use(VueGoogleMaps, {
//   load: {
//     libraries: 'places', // necessary for places input
//     key: "AIzaSyDdMfohmlw-A2h2rUNJsbMc7Afvy3m1zt4"    
//   }
// });

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
