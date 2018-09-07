<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <EnterUser @submitUserForm="submitHandler"/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import EnterUser from "@/components/home/EnterUser.vue";
export default {
  name: "home",
  components: {
    EnterUser
  },
  methods: {
    submitHandler(name) {
      this.$socket.emit("enterSystem", { name }, (err, user) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(user);
        this.$store.commit("setUser", user);
        window.localStorage.setItem("userId", user.id);
        this.$router.push("/roomlist");
      });
    }
  }
};
</script>
