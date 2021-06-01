<template>
  <div>
    <v-row align-content="center">
      <v-card>
        <v-sheet
            class="v-sheet--offset mx-auto"
            color="#00b0fc"
            elevation="12"
            max-width="calc(100% - 32px)"
        >
          <v-sparkline
              label-size="15"
              :labels="labels"
              :value="value"
              color="white"
              line-width="2"
              padding="16"
              auto-draw
          ></v-sparkline>

        </v-sheet>

        <v-card-text class="pt-0">
          <div class="title font-weight-light mb-2">
            Регистрация пользователей
          </div>
          <p class="subtitle-2 font-weight-light grey--text">Всего за неделю зарегестрировались 7 пользователей</p>
          <v-divider class="my-2"></v-divider>
          <v-icon
              class="mr-2"
              small
          >
            mdi-clock
          </v-icon>
          <span class="caption grey--text font-weight-light">последняя регистрация 6 минут назад</span>
        </v-card-text>

        <v-card-actions>
          <v-btn
              text
              color="#ffb463"
              @click="infoCards.users.chartReveal = !infoCards.users.chartReveal"
          >
            Сводка
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <v-card
              max-width="calc(100%)"
              v-if="infoCards.users.chartReveal"
              class="transition-fast-in-fast-out"
          >
            <v-card-text>
              <div class="subtitle-1">Всего пользоваетелей : 133333</div>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-card>
      <v-card>

      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      infoCards: {
        users: {
          totalAmount: 0,
          chartReveal: false,
          chart: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
          }
        }
      },
      labels: [
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс'
      ],
      value: [
        1,
        3,
        4,
        5,
        7,
        0,
        0,
      ],
    }
  },
  mounted() {
    this.$store.commit('changeHeaderName', {'name' : 'Главная'})
    this.$http.get('/admin/dashboard/get-users-card-details')
        .then((resp) => {
          console.log(resp.data);
        })
  }
}
</script>

<style scoped>

</style>
