<template>
  <div id="app">
<!--    <gridTest/>-->
    <demo-drag></demo-drag>
  </div>
</template>

<script>
// import gridTest from "@/components/gridTest.vue";
import demoDrag from "@/components/demoDrag.vue";

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // gridTest
    demoDrag
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
  height: 100%;
}
body,html {
  height: 100%;
  margin: 0;
}
</style>
