<template>
  <v-navigation-drawer app :mini-variant="miniVariant">
    <v-list
        dense
        nav
    >
      <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.route"
          link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: "Sidebar",
  data () {
    return {
      items: [
        { title: 'Главная', icon: 'mdi-view-dashboard', route: "/"},
        { title: 'Стартапы', icon: 'mdi-google-my-business', route: "/all-startups"},
        { title: 'Заявки стартапов', icon: 'mdi-account-alert', route:"/startups"},
        { title: 'Курсы', icon: 'mdi-book', route:"/courses"},
      ]
    }
  },
  computed : {
    ...mapGetters({
      miniVariant: 'isNdMiniVariant'
    })
  }
}
</script>

<style scoped>

</style>
