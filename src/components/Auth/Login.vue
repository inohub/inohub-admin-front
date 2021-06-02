<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-card-title>email: ondricka.bernie@example.net |  password: password</v-card-title>
              <v-toolbar dark color="#b19ae8">
                <v-toolbar-title>Inohub administration</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                      label="Email"
                      v-model="email"
                      type="text"
                  ></v-text-field>
                  <v-text-field
                      label="Password"
                      v-model="password"
                      type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#b19ae8" to="/" outlined @click="login">login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods : {
    login() {
      const {email, password} = this;

      this.$store.dispatch('AUTH_REQUEST', {email, password}).then(() => {
        console.log('successfully authenticated')

      })
      .catch(() => {console.log('error occurred')})
    }
  }
}
</script>

<style scoped>

</style>
