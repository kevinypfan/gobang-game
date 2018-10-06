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
      this.axios
        .post("/entrySystem", { name })
        .then(({ data }) => {
          console.log(data);
          this.$store.commit("setUser", data);
          window.localStorage.setItem("userId", data.id);
          this.$router.push("/roomlist");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
