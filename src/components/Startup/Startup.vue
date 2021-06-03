<template>
  <div>
    <v-data-table
        :loading="loading"
        :headers="headers"
        :items="startups"
        class="elevation-1"
        hide-default-footer
    >
      <template v-slot:item.full_name="{ item }">
          {{ item.owner.profile.first_name + ' ' + item.owner.profile.last_name }}
      </template>

      <template v-slot:item.published_at="{ item }">
          {{ item.published_at |  moment("dddd, MMMM Do YYYY")}}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="show(item.id)"><v-icon>mdi-account-search</v-icon></v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "Startup",
  mounted() {
    this.$store.commit('changeHeaderName', {'name': 'Заявки стартапов'})
    this.getStartups()
  },
  data() {
    return {
      headers: [
        {text: "id", value: "id"},
        {text: "от Пользователя", value: "full_name"},
        {text: "Название", value: "name"},
        {text: "Наименование", value: "subtitle"},
        {text: "Дата создания заявки", value: "published_at"},
        {text: "", value: "actions"},
      ],
      startups: [],
      loading: false
    }
  },
  methods: {
    getStartups() {
      this.loading = true;

      this.$http.get('/admin/startups/to-approve')
      .then(response => {
        this.loading = false;
        this.startups = response.data.data;
      })
      .catch(error => {
        this.$store.commit('toggleSnackbar', {color:'error', text: error.message});
      })
    },
    show(id) {
      this.$router.push(`/startups/${id}`)
    }
  }
}
</script>

<style scoped>

</style>
