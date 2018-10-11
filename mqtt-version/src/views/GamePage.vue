<template>
  <gobang-game v-if="character" :room="room" :character="character"/>
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
    this.axios
      .get("/getRoomStatus/" + this.$route.params.id)
      .then(({ data }) => {
        this.room = data;
        this.$store.commit("setRoom", data);
        if (data.joined.length == 2) {
          this.character =
            this.$store.state.user.id === data.joined[0].id ? 1 : 2;
        } else {
          this.character = this.$store.state.user.id === data.owner.id ? 1 : 2;
        }
      })
      .catch(err => {
        console.log(err);
      });
    // this.$socket.emit("getRoomStatus", this.$route.params.id, (err, room) => {
    //   if (err) return console.log(err);
    //   this.room = room;
    //   this.character = this.$store.state.user.id === room.owner.id ? 1 : 2;
    // });
  }
};
</script>

<style>
</style>
