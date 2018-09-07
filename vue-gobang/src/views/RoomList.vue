<template>
  <div>
    <h3 class="title">Room List</h3>
    <ul class="list-group">
      <li 
        v-if="roomList"
        v-for="room in roomList" 
        :key="room.id"
        class="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
        @click="joinRoomClick(room.id)"
      >
        {{ room.roomName }}
        <span class="badge badge-primary badge-pill">{{ room.joined.length+1 + '/2'  }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data: () => ({
    roomList: null
  }),
  mounted() {
    if (!this.$store.state.user) {
      const roomString = window.localStorage.getItem("room");
      const userId = window.localStorage.getItem("userId");
      this.$socket.emit(
        "hasUser",
        { userId, room: JSON.parse(roomString) },
        (err, user) => {
          if (err) {
            console.log(err);
            this.$router.replace("/");
            return;
          }
          this.$store.commit("setRoom", room);
          this.$store.commit("setUser", user);
        }
      );
    }

    this.$socket.emit("getRoomList");
  },
  sockets: {
    getRoomList(payload) {
      this.roomList = payload;
    },
    updateRoomList(payload) {
      this.roomList.push(payload);
    }
  },
  methods: {
    joinRoomClick(roomId) {
      this.$socket.emit(
        "joinRoom",
        {
          roomId,
          gamer: this.$store.state.user
        },
        (err, room) => {
          if (err) return console.log(err);
          console.log(room);
          this.$store.commit("setRoom", room);
          window.localStorage.setItem("room", JSON.stringify(room));
          this.$router.push("/roomwait/" + room.id);
        }
      );
    }
  }
};
</script>
