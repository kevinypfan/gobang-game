<template>
<div v-if="room">
  <h3>Room Wait</h3>
  <p>Room: {{room.roomName}}</p>
  <button @click="startGame">Start</button>
  <div class="row">
    <div class="col-6" v-if="room.owner">
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
    <div class="col-6" v-if="room.joined.length > 1">
      <ul class="list-group">
        <li 
          v-if="room.joined.length > 0"
          class="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
        >
          {{ room.joined[1].name }}
          <span class="badge badge-primary badge-pill">{{ room.joined[1].ready ? 'ready': ''  }}</span>
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
  mqtt: {
    'gobang/#'(data, topic) {
      console.log(topic);
      const topicArray = topic.split('/');
      if (this.room) {
        if (topicArray[1] === this.room.id) {
          console.log(topicArray[2]);
          switch (topicArray[2]) {
            case 'startGame':
              console.log('gameStarted');
              this.$router.push('/gamepage/' + this.room.id);
              break;
            case 'updateRoomDetail':
              this.room = JSON.parse(data.toString());
              break;
          }
        }
      }
    }
  },
  mounted() {
    this.axios
      .get('/getRoomStatus/' + this.$route.params.id)
      .then(({ data }) => {
        this.$store.commit('setRoom', data);
        this.room = data;
      })
      .catch(err => console.log(err));
  },
  methods: {
    startGame() {
      if (this.$store.state.user.id == this.room.owner.id) {
        this.$socket.emit('startGame', this.room);
        this.axios
          .post('/startGame', {
            user: this.$store.state.user,
            roomData: this.room
          })
          .then(({ data }) => console.log(data))
          .catch(err => console.log(err));
      }
    }
  }
};
</script>
