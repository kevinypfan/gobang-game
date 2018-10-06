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
      const roomString = window.localStorage.getItem('room');
      const userId = window.localStorage.getItem('userId');
      this.axios
        .post('hasUser', userId)
        .then(result => {
          this.$store.commit('setUser', user);
        })
        .catch(err => {
          console.log(err);
          this.$router.replace('/');
        });
      // this.$socket.emit(
      //   "hasUser",
      //   { userId, room: JSON.parse(roomString) },
      //   (err, user) => {
      //     if (err) {
      //       console.log(err);
      //       this.$router.replace("/");
      //       return;
      //     }
      //     this.$store.commit("setRoom", room);
      //     this.$store.commit("setUser", user);
      //   }
      // );
    }
    this.axios
      .get('/getRoomList')
      .then(({ data }) => {
        this.roomList = data;
      })
      .catch(err => console.log(err));
  },
  mqtt: {
    'gobang/updateRoomList'(data, topic) {
      this.roomList.push(JSON.parse(data));
    }
  },
  methods: {
    joinRoomClick(roomId) {
      this.axios
        .post('/joinRoom', {
          roomId,
          gamer: this.$store.state.user
        })
        .then(({ data }) => {
          console.log(data);
          this.$store.commit('setRoom', data);
          window.localStorage.setItem('room', JSON.stringify(data));
          this.$router.push('/roomwait/' + roomId);
        })
        .catch(err => console.log(err));
      // this.$socket.emit(
      //   "joinRoom",
      //   {
      //     roomId,
      //     gamer: this.$store.state.user
      //   },
      //   (err, room) => {
      //     if (err) return console.log(err);
      //     console.log(room);
      //     this.$store.commit("setRoom", room);
      //     window.localStorage.setItem("room", JSON.stringify(room));
      //     this.$router.push("/roomwait/" + room.id);
      //   }
      // );
    }
  }
};
</script>
