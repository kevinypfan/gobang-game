<template>
<div v-if="room">
  <h3>Room Wait</h3>
  <p>Room: {{room.roomName}}</p>
  <button @click="startGame">Start</button>
  <div class="row">
    <div class="col-6">
      <ul class="list-group">
      <li 
        class="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
      >
        {{ room.owner.name }}
        <span class="badge badge-primary badge-pill">owner</span>
      </li>
    </ul>
    </div>
    <div class="col-6">
      <ul class="list-group">
      <li 
        v-if="room.joined.length > 0"
        class="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
      >
        {{ room.joined[0].name }}
        <span class="badge badge-primary badge-pill">{{ room.joined[0].ready ? 'ready': ''  }}</span>
      </li>
    </ul>
    </div>
  </div>
</div>
  
</template>
<script>
export default {
  data: () => ({
    room: null
  }),
  sockets: {
    gameStarted(room) {
      console.log(room);
      this.$router.push("/gamepage/" + room.id);
    },
    updateRoomDetail(room) {
      this.room = room;
    }
  },
  mounted() {
    this.$socket.emit("getRoomStatus", this.$route.params.id, (err, room) => {
      if (err) return console.log(err);
      this.$store.commit("setRoom", room);
      this.room = room;
    });
  },
  methods: {
    startGame() {
      if (this.$store.state.user.id == this.room.owner.id) {
        this.$socket.emit("startGame", this.room);
      }
    }
  }
};
</script>
