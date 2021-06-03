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
        {{ item.created_at |  moment("Y-MM-DD") }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "AllStartups",
  mounted() {
    this.$store.commit('changeHeaderName', {'name': 'Стартапы'})
    this.getStartups()
  },
  data() {
    return {
      headers: [
        {text: "id", value: "id"},
        {text: "Название", value: "name"},
        {text: "Наименование", value: "subtitle"},
        {text: "Сумма сборов(KZT)", value: "donation_amount"},
        {text: "Создан", value: "published_at"}
      ],
      startups: [],
      loading: false
    }
  },
  methods: {
    getStartups() {
      this.loading = true;

      this.$http.get('/startups?relation[owner]')
          .then(response => {
            this.loading = false;
            this.startups = response.data.data;
            console.log(response)
          })
          .catch(error => {
            this.$store.commit('toggleSnackbar', {color: 'error', text: error.message});
          })
    }
  }
}
</script>

<style scoped>

</style>
