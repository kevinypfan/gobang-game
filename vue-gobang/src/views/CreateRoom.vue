<template>
  <form @submit.prevent="onSubmitForm">
    <label for="roomName">Room Name: </label>
    <input type="text" id="roomName" v-model="roomName">
    <button type="submit">submit</button>
  </form>
</template>
<script>
export default {
  data: () => ({
    roomName: ""
  }),
  methods: {
    onSubmitForm() {
      this.$socket.emit(
        "createRoom",
        { roomName: this.roomName, owner: this.$store.state.user },
        (err, room) => {
          if (err) {
            console.log(err);
            return;
          }
          window.localStorage.setItem("room", JSON.stringify(room));
          this.$router.push("/roomWait/" + room.id);
        }
      );
    }
  }
};
</script>
