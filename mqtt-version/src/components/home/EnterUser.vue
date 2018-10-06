<template>
  <form @submit.prevent="onSubmitForm">
    <label for="userName">User Name: </label>
    <input type="text" id="userName" v-model="userName">
    <button type="submit">submit</button>
  </form>
</template>
<script>
export default {
  data: () => ({
    userName: ""
  }),
  methods: {
    onSubmitForm() {
      this.$emit("submitUserForm", this.userName);
    }
  }
};
</script>
