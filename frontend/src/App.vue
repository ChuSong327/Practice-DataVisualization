<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Hello World"/>
    <PieChart/>
    <TwoPieChart/>
  </div>
</template>

<script>
/* eslint-disable */
import HelloWorld from './components/HelloWorld.vue'
import PieChart from "./components/PieChart.vue"
import TwoPieChart from "./components/TwoPieChart.vue"

export default {
  name: 'app',
  components: {
    HelloWorld,
    PieChart,
    TwoPieChart
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
