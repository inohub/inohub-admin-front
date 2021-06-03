<template>
  <v-data-table
      :loading="loading"
      :headers="headers"
      :items="tests"
      hide-default-footer
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-dialog
            v-model="createDialog"
            max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >
              Добавить тест
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Добавить тест</span>
            </v-card-title>

            <v-card-text>

              <v-text-field
                  v-model="name"
                  label="Название теста"
              ></v-text-field>

            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  :loading="saveLoading"
                  @click="close"
              >
                Отмена
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  :loading="saveLoading"
                  @click="save"
              >
                Создать
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.questions_count="{ item }">
      <v-btn link :to="`/tests/${item.id}/questions`">{{item.questions_count}}</v-btn>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-dialog
          :retain-focus="false"
          v-model="editDialog"
          max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Редактировать тест</span>
          </v-card-title>

          <v-card-text>

            <v-textarea
                v-model="name"
                label="Название теста"
            ></v-textarea>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                :loading="editLoading"
                @click="close"
            >
              Отмена
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                :loading="editLoading"
                @click="edit"
            >
              Изменить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
          @click="openEditDialog(item)"
          color="blue"
          dark
          class="mb-2"
      >
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
      <v-btn class="red" @click="deleteTest(item.id)"><v-icon>mdi-delete-forever</v-icon></v-btn>
    </template>
    <template v-slot:footer>
      <v-pagination v-model="page"
                    :length="totalPaginationLength"
                    @input="getTests">

      </v-pagination>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Tests",
  mounted() {
    this.getTests()
    this.$store.commit('changeHeaderName', {'name': 'Тесты'})
  },
  data() {
    return {
      loading: false,
      headers: [
        {text: "id", value: "id"},
        {text: "Название", value: "name"},
        {text: "Урок", value: "lesson.name"},
        {text: "Вопросы", value: "questions_count"},
        {text: "Дата создания", value: "created_at"},
        {text: "Действия", value: "actions"},
      ],
      tabs: [],
      tests :[],
      createDialog: false,
      editDialog: false,
      name: '',
      saveLoading: false,
      editLoading: false,
      page: 1,
      totalPaginationLength: 0,
      lessonId: this.$route.params.id,
      editId: null
    }
  },
  methods: {
    getTests() {
      this.loading = true;
      let url = `/tests?search[lesson_id]=exact|${this.lessonId}&relation[lesson]&count[]=questions&page=${this.page}`;
      this.$http.get(url)
          .then(resp => {
            this.tests = resp.data.data.data;
            this.totalPaginationLength = Math.floor(resp.data.data.total / 20);
            this.loading = false;
          })
          .catch(err => {
            this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
            this.loading = false;
          })
    },
    openEditDialog(item) {
      this.editDialog = true;
      this.name = item.name;
      this.editId = item.id;
    },
    close() {
      this.createDialog = false;
      this.editDialog = false;
      this.name = '';
      this.editId = null;
    },
    save() {
      this.saveLoading = true;

      const {lessonId, name} = this;

      this.$http
          .post('tests', {
            lesson_id: lessonId,
            name
          })
          .then(() => {
            this.getTests();
            this.saveLoading = false;
          })
          .catch(err => {
            let errors = err.response.data.data;
            let keys = Object.keys(errors);
            keys.forEach(key => {
              this.$store.commit('toggleSnackbar', {text: errors[key][0], color: "error"});
            });
            this.saveLoading = false;
          });

      this.close();
    },
    edit() {
      this.editLoading = true;
      let item = this.tests.find(v => v.id === this.editId);

      const {name} = this;

      this.$http
          .put(`tests/${item.id}`, {
            name
          })
          .then(() => {
            this.getTests();
            this.editLoading = false;
          })
          .catch(err => {
            let errors = err.response.data.data;
            let keys = Object.keys(errors);
            keys.forEach(key => {
              this.$store.commit('toggleSnackbar', {text: errors[key][0], color: "error"});
            });
            this.editLoading = false;
          });

      this.close();
    },
    deleteTest(id) {
      this.$http.delete(`/tests/${id}`)
          .then(() => {
            this.getTests();
          })
          .catch(err => {
            this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
            this.loading = false;
          })
    },
    paginate() {
      this.getTests()
    }
  }
}
</script>

<style scoped>

</style>
