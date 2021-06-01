<template>
  <div>
    <Layout v-if="isAuthenticated"></Layout>
    <Login v-else></Login>
    <Snackbar></Snackbar>
  </div>
</template>

<script>
import Layout from "@/components/Layout/Layout";
import Login from "@/components/Auth/Login";
import Snackbar from "@/components/Utils/Snackbar";

export default {
  name: 'App',

  components: {
    Snackbar,
    Login,
    Layout
  },

  data: () => ({
    //
  }),

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  }
};
</script>
