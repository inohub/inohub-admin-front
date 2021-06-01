<template>
  <div v-if="startup">
    <v-card :loading="loading">
      <v-toolbar
          flat
          color="primary"
          dark
      >
        <v-toolbar-title>Стартап : {{startup.name}}</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical v-if="startup">
        <v-tab>
          <v-icon left>
            mdi-account
          </v-icon>
          Представитель
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-newspaper-variant-outline
          </v-icon>
          Описание
        </v-tab>
        <v-tab>
          <v-icon left>
            mdi-access-point
          </v-icon>
          Вынести решение
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-tabs v-if="startup">
              <v-tab>
                Базовая информация
              </v-tab>
              <v-tab>
                <v-icon left>
                  mdi-lock
                </v-icon>
                Благонадежность
              </v-tab>
              <v-tab>
                <v-icon left>
                  mdi-police-badge-outline
                </v-icon>
                Суды
              </v-tab>

              <v-tab-item>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                    <tr
                        v-show="startup"
                        v-for="(key,item) in startup.adata.basic"
                        :key="key"
                    >
                      <td>{{ item }}</td>
                      <td>{{ key }}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tab-item>
              <v-tab-item>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                    <tr>
                        <td>Запрет на выход из страны</td>
                        <td><v-icon>{{startup.adata.reliability.ban_leaving ? 'mdi-check' : 'mdi-cancel'}}</v-icon></td>
                    </tr>
                    <tr>
                        <td>Налоговая задолженность</td>
                        <td><v-icon>{{startup.adata.reliability.enforcement_debt ? 'mdi-check' : 'mdi-cancel'}}</v-icon></td>
                    </tr>
                    <tr>
                        <td>Террорист</td>
                        <td><v-icon>{{startup.adata.reliability.terrorist ? 'mdi-check' : 'mdi-cancel'}}</v-icon></td>
                    </tr>
                    <tr>
                        <td>Педофил</td>
                        <td><v-icon>{{startup.adata.reliability.pedophile ? 'mdi-check' : 'mdi-cancel'}}</v-icon></td>
                    </tr>
                    <tr>
                        <td>Алиментоплательщик</td>
                        <td><v-icon>{{startup.adata.reliability.alimony_payer ? 'mdi-check' : 'mdi-cancel'}}</v-icon></td>
                    </tr>
                    <tr>
                        <td>Арест на имущество</td>
                        <td><v-icon>{{startup.adata.reliability.seized_property ? 'mdi-check' : 'mdi-cancel'}}</v-icon></td>
                    </tr>
                    <tr>
                        <td>Запрет на совершение наториальных действий</td>
                        <td><v-icon>{{!startup.adata.reliability.ban_notarius_actions ? 'mdi-check' : 'mdi-cancel'}}</v-icon></td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tab-item>
              <v-tab-item>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                    <tr>
                      <td>Количество административных судов</td>
                      <td>{{startup.adata.litigation.total_administrative_count}}</td>
                    </tr>
                    <tr>
                      <td>Количество гражданских судов</td>
                      <td>{{startup.adata.litigation.total_civil_count}}</td>
                    </tr>
                    <tr>
                      <td>Количество судов связанных с криминалом</td>
                      <td>{{startup.adata.litigation.total_criminal_count}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <div v-for="text in startup.texts" :key="text.title">
              <v-card-title>{{text.title}}</v-card-title>
              <v-card-text v-html="text.content">
              </v-card-text>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>После того как вы ознокомились вынесите ваше решение касательно публикации стартапа</p>
              <v-text-field label="Причина отказа" v-model="cancellationReason"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn class="primary" @click="approve" :loading="btnLoading" :disabled="cancelBtnDisabled">Публиковать</v-btn>
              <v-btn class="red" @click="cancel" :disabled="!cancelBtnDisabled" :loading="btnLoading">Отказать</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Show",
  mounted() {
    this.getStartup()
  },
  data() {
    return {
      loading:false,
      startup: {},
      btnLoading: false,
      cancellationReason : ''
    }
  },
  computed: {
    cancelBtnDisabled() {
      return this.cancellationReason !== ''
    }
  },
  methods: {
    getStartup() {
      this.loading = true;

      this.$http.get(`/admin/startups/to-approve/${this.$route.params.id}`)
      .then(response => {
        this.loading = false;
        this.startup = response.data;
        console.log(response)
      })
      .catch(err => {
        this.loading = false;
        console.log(err)
      })
    },
    approve() {
      this.btnLoading = true

      this.$http.post(`/admin/startups/to-approve/${this.$route.params.id}/approve`)
      .then(response => {
        this.btnLoading = false;
        this.$store.commit('toggleSnackbar', {color:'success', text: 'Стартап был опубликован на платформе'});
        this.$router.push({name : 'Startups'})
        console.log(response)
      })
      .catch(err => {
        this.btnLoading = false;
        this.$store.commit('toggleSnackbar', {color:'error', text:err.message})
      })
    },
    cancel() {
      this.btnLoading = true

      this.$http.post(`/admin/startups/to-approve/${this.$route.params.id}/cancel`, {
        cancellation_reason : this.cancellationReason
      })
          .then(response => {
            this.btnLoading = false;
            this.$store.commit('toggleSnackbar', {color:'success', text: 'Стартап был отклонен'});
            this.$router.push({name : 'Startups'})
            console.log(response)
          })
          .catch(err => {
            this.btnLoading = false;
            this.$store.commit('toggleSnackbar', {color:'error', text:err.message})
          })
    }
  }
}
</script>

<style scoped>

</style>
