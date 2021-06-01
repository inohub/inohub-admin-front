<template>
  <v-app>
    <Header></Header>
    <v-container class="mt-5">
      <v-main>
        <router-view/>
      </v-main>
    </v-container>
    <Sidebar></Sidebar>
  </v-app>
</template>

<script>
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";

export default {
  name: "Layout",
  components: {
    Sidebar,
    Header
  },
}

</script>

<style scoped>

</style>