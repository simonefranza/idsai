<template>
  <div id="app">
    <ReccSys />
  </div>
</template>

<script>
import ReccSys from './components/ReccSys.vue'

export default {
  name: 'App',
  components: {
    ReccSys
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
