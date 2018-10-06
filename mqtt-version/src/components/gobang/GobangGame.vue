<template>
<div>
  <button type="reset" @click="$socket.emit('resetGame', room)">Reset</button>
<canvas id="chess" width="450px" height="450px">	
	</canvas>

</div>
  
</template>
<script>
export default {
  props: ["character", "room"],
  data: () => ({
    player: 1,
    over: false,
    wins: [],
    player1: [],
    player2: [],
    chessBoard: [],
    count: 0
  }),
  sockets: {
    onResetGame() {
      this.resetData();
    }
  },
  methods: {
    resetData() {
      this.player = 1;
      this.over = false;
      this.count = 0;
      for (var i = 0; i < 15; i++) {
        this.chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
          this.chessBoard[i][j] = 0;
        }
      }

      for (var i = 0; i < 15; i++) {
        this.wins[i] = [];
        for (var j = 0; j < 15; j++) {
          this.wins[i][j] = [];
        }
      }

      //横线
      for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[i][j + k][this.count] = true;
          }
          this.count++;
        }
      }
      //竖线
      for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[j + k][i][this.count] = true;
          }
          this.count++;
        }
      }
      //斜线
      for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 11; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[i + k][j + k][this.count] = true;
          }
          this.count++;
        }
      }
      //反斜线
      for (var i = 0; i < 11; i++) {
        for (var j = 14; j > 3; j--) {
          for (var k = 0; k < 5; k++) {
            this.wins[i + k][j - k][this.count] = true;
          }
          this.count++;
        }
      }

      for (var i = 0; i < this.count; i++) {
        this.player1[i] = 0;
        this.player2[i] = 0;
      }
      var chess = document.getElementById("chess");
      var context = chess.getContext("2d");
      context.strokeStyle = "#fff";
      context.clearRect(0, 0, chess.width, chess.height);

      context.strokeStyle = "#000";

      var drawChessBoard = function() {
        for (var i = 0; i < 15; i++) {
          context.beginPath();
          context.moveTo(15 + i * 30, 15);
          context.lineTo(15 + i * 30, 435);
          context.stroke();
          context.moveTo(15, 15 + i * 30);
          context.lineTo(435, 15 + i * 30);
          context.stroke();
          context.closePath();
        }
      };
      drawChessBoard();
    }
  },
  mounted() {
    this.resetData();
    var chess = document.getElementById("chess");
    var context = chess.getContext("2d");
    var oneStep = (i, j) => {
      context.beginPath();
      context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
      context.closePath();
      var gradient = context.createRadialGradient(
        15 + i * 30 + 2,
        15 + j * 30 - 2,
        13,
        15 + i * 30 + 2,
        15 + j * 30 - 2,
        0
      );
      if (this.player == 1) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
      } else if (this.player == 2) {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
      }
      context.fillStyle = gradient;
      context.fill();
    };

    const pressMethod = (i, j) => {
      if (this.chessBoard[i][j] == 0) {
        oneStep(i, j);

        if (this.player == 1) {
          this.chessBoard[i][j] = 1;
          for (var k = 0; k < this.count; k++) {
            if (this.wins[i][j][k]) {
              this.player1[k]++;
              this.player2[k] = 6;
              if (this.player1[k] == 5) {
                window.alert("this.player1 win!");
                this.over = true;
              }
            }
          }
          this.player = 2;
        } else {
          this.chessBoard[i][j] = 2;
          for (var k = 0; k < this.count; k++) {
            if (this.wins[i][j][k]) {
              this.player2[k]++;
              this.player1[k] = 6;
              if (this.player2[k] == 5) {
                window.alert("this.player2 win!");
                this.over = true;
              }
            }
          }
          this.player = 1;
        }
      }
    };

    this.$options.sockets.chessPressed = data => {
      const { chessPos, userData } = data;
      pressMethod(chessPos.i, chessPos.j);
    };

    chess.onclick = e => {
      if (this.over) {
        return;
      }
      if (this.character != this.player) {
        return;
      }
      var x = e.offsetX;
      var y = e.offsetY;
      var i = Math.floor(x / 30); //Math.floor向下取整
      var j = Math.floor(y / 30);
      this.$socket.emit(
        "pressChess",
        {
          chessPos: { i, j },
          roomData: this.room,
          userData: this.$store.state.user
        },
        () => {
          pressMethod(i, j);
        }
      );
    };
  }
};
</script>
<style scoped>
canvas {
  display: block;
  margin: 50px auto;
  box-shadow: -2px -2px 2px #efefef, 5px 5px 5px #b9b9b9;
  color: #fff;
}
</style>
