<template>
  <gobang-game :room="room" :character="character"/>
</template>

<script>
import GobangGame from "@/components/gobang/GobangGame.vue";
export default {
  data: () => ({
    room: null,
    character: null
  }),
  components: {
    GobangGame
  },
  created() {
    this.$socket.emit("getRoomStatus", this.$route.params.id, (err, room) => {
      if (err) return console.log(err);
      this.room = room;
      this.character = this.$store.state.user.id === room.owner.id ? 1 : 2;
    });
  }
};
</script>

<style>
</style>
