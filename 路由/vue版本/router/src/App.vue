<template>
  <div id="app">
    <img src="./assets/logo.png">
    <historyComponent/>
  </div>
</template>

<script>
import hashComponent from './components/hash'
import historyComponent from './components/history'
export default {
  name: 'App',
  components: {
    hashComponent,
    historyComponent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
