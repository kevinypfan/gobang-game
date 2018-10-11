<template>
  <div id="app">
    <div id="nav">
      <router-link to="/createroom">Create Room</router-link>
    </div>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  // sockets: {
  //   connect: function() {
  //     console.log("socket connected");
  //   },
  //   customEmit: function(data) {
  //     console.log(data);
  //   }
  // },
  mqtt: {
    // "wow/+"(data, topic) {
    //   console.log("wow/+", topic, data.toString());
    // },
  },
  created() {
    this.$mqtt.subscribe("gobang/#");
  }
};
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
