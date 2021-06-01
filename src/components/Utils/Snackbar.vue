<template>
  <v-app>
    <div>
      <v-snackbar
          v-model="show"
          :timeout="3000"
          :color="color">
        {{ text }}
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "Snackbar",
  data() {
    return {
      show: false,
      text: "",
      color: "",
    };
  },
  created: function () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'toggleSnackbar') {
        this.text = state.snackbar.text
        this.color = state.snackbar.color
        this.show = true;
      }
    })
  }
}
</script>

<style scoped>

</style>