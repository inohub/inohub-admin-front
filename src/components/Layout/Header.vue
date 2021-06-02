<template>
  <v-app-bar
      absolute
      color="#b19ae8"
      app
      dark
  >
    <v-app-bar-nav-icon @click="$store.commit('toggleNdMiniVariant')"></v-app-bar-nav-icon>

    <div class="title">{{this.$store.state.headerComponentName}}</div>

    <v-spacer></v-spacer>

    <v-btn icon href="https://inohub.kz">
      <v-icon>mdi-logout</v-icon>
    </v-btn>

  </v-app-bar>
</template>

<script>
export default {
  name: "Header",
  methods: {

  }
}
</script>

<style scoped>

</style>
