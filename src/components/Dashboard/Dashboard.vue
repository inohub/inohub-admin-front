<template>
  <div>
    <v-row class="d-flex">
      <v-card :loading="loadingChart">
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
              max-width=""
              v-if="infoCards.users.chartReveal"
              class="transition-fast-in-fast-out"
          >
            <v-card-text>
              <div class="subtitle-1">Всего пользоваетелей : 133333</div>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-card>
      <v-card
          :loading="loadingInvestor"
          class="mx-auto"
          max-width="344"
      >
        <v-img
            src="https://www.insidehighered.com/sites/default/server_files/media/iStock-900872896_0.jpg"
            height="200px"
        ></v-img>

        <v-card-title>
            самый щедрый инвестор:
        </v-card-title>

        <v-card-subtitle>
          {{user.profile.first_name +" "+  user.profile.last_name}} c пожертвованием суммы более чем {{user.donations_sum_amount}} KZT
        </v-card-subtitle>
      </v-card>
      <v-card
          :loading="loadingInvestor"
          class="mx-auto"
          max-width="344"
      >
        <v-img
            src="https://www.insidehighered.com/sites/default/server_files/media/iStock-900872896_0.jpg"
            height="200px"
        ></v-img>

        <v-card-title>
            самый щедрый инвестор:
        </v-card-title>

        <v-card-subtitle>
          {{user.profile.first_name +" "+  user.profile.last_name}} c пожертвованием суммы более чем {{user.donations_sum_amount}} KZT
        </v-card-subtitle>
      </v-card>
      <v-card
          :loading="loadingInvestor"
          class="mx-auto"
          max-width="344"
      >
        <v-img
            src="https://www.insidehighered.com/sites/default/server_files/media/iStock-900872896_0.jpg"
            height="200px"
        ></v-img>

        <v-card-title>
            самый щедрый инвестор:
        </v-card-title>

        <v-card-subtitle>
          {{user.profile.first_name +" "+  user.profile.last_name}} c пожертвованием суммы более чем {{user.donations_sum_amount}} KZT
        </v-card-subtitle>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      loadingChart: false,
      loadingInvestor: false,
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
      user: {}
    }
  },
  mounted() {
    this.$store.commit('changeHeaderName', {'name' : 'Главная'})
    this.loadingChart = true;
    this.$http.get('/admin/dashboard/get-users-card-details')
        .then((resp) => {
          this.loadingChart = false;
          console.log(resp.data);
        })
    this.getInvestor()
  },
  methods: {
    getInvestor() {
      this.loadingInvestor = true;
      this.$http.get('/admin/dashboard/get-top-investor')
          .then(resp => {
            this.loadingInvestor = false;
            this.user = resp.data.data;
            console.log(resp.data)
          })
          .catch(err => {
            console.log(err)
          })
    }
  }
}
</script>

<style scoped>

</style>
