<template>
  <div id="app">
    <router-view class="animated fadeIn" />
  </div>
</template>

<script>
  import Vue from 'vue'
  var deviceReady = false
  export default {
    name: 'App',
    mounted() {
      document.addEventListener('deviceReady', () => {
        console.log("Kelf Kappa Pride")
        deviceReady = true
      }, false)
      console.log("AAAAAAAAAAAAAAAAAAA")
      console.log(Vue.cordova)
      Vue.cordova.on('deviceready', () => {
          console.log("Ola Amigos")
          alert("Don KappaPride")
      });
      if (deviceReady) {
        console.log("Cordova Succ")
      } else {
        console.log("Cordova Rocks")
      }
    }
  }
</script>




<style>
  @import url("https://use.fontawesome.com/releases/v5.1.1/css/all.css");

  #app {
    font-family: Lato;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50;
  margin-top: 60px; */
  }

</style>
