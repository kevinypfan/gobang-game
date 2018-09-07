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
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    customEmit: function(data) {
      console.log(data);
    }
  },
  methods: {
    clickButton: function(val) {
      // $socket is socket.io-client instance
      this.$socket.emit("event", { name: "Kevin" });
    }
  },
  created() {
    const userId = window.localStorage.getItem("userId");
    const roomString = window.localStorage.getItem("room");
    const room = JSON.parse(roomString);
    if (!userId) {
      this.$router.replace("/");
    } else {
      this.$socket.emit("hasUser", { userId, room }, (err, user) => {
        if (err) {
          console.log(err);
          this.$router.replace("/");
          return;
        }
        this.$store.commit("setRoom", room);
        this.$store.commit("setUser", user);
      });
    }
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
