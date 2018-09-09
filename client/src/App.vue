<template>
  <div id="app">
    <router-view class="animated fadeIn"/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
