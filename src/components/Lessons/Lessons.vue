<template>
  <v-data-table
      :loading="loading"
      :headers="headers"
      :items="lessons"
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
              Добавить урок
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Добавить урок</span>
            </v-card-title>

            <v-card-text>

              <v-text-field
                  v-model="name"
                  label="Название урока"
              ></v-text-field>
              <v-textarea
                  v-model="description"
                  label="Описание урока"
              ></v-textarea>

              <v-list>
                <v-subheader>Контенты</v-subheader>
                <v-list-item v-for="(item, index) in texts" :key="index">
                  <v-card-text>
                    <v-text-field
                        v-model="item.title"
                        label="Загаловок контента"
                    ></v-text-field>
                    <v-textarea
                        v-model="item.content"
                        label="Текст контента"
                    ></v-textarea>
                  </v-card-text>
                </v-list-item>
              </v-list>

            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  :loading="saveLoading"
                  @click="addText"
              >
                Добавить контент
              </v-btn>
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
    <template v-slot:item.tests_count="{ item }">
      <v-btn link :to="`/lessons/${item.id}/tests`">{{item.tests_count}}</v-btn>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-dialog
          :retain-focus="false"
          v-model="editDialog"
          max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Редактировать урок</span>
          </v-card-title>

          <v-card-text>

            <v-textarea
                v-model="description"
                label="Описание курса"
            ></v-textarea>

            <v-list>
              <v-subheader>Контенты</v-subheader>
              <v-list-item v-for="(item, index) in texts" :key="index">
                <v-card-text>
                  <v-text-field
                      v-model="item.title"
                      label="Загаловок контента"
                  ></v-text-field>
                  <v-textarea
                      v-model="item.content"
                      label="Текст контента"
                  ></v-textarea>
                </v-card-text>
              </v-list-item>
            </v-list>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                :loading="editLoading"
                @click="addText"
            >
              Добавить контент
            </v-btn>
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
      <v-btn class="red" @click="deleteLesson(item.id)"><v-icon>mdi-delete-forever</v-icon></v-btn>
    </template>
    <template v-slot:footer>
      <v-pagination v-model="page"
                    :length="totalPaginationLength"
                    @input="getLessons">

      </v-pagination>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Lessons",
  mounted() {
    this.getLessons()
    this.$store.commit('changeHeaderName', {'name': 'Уроки'})
  },
  data() {
    return {
      loading: false,
      headers: [
        {text: "id", value: "id"},
        {text: "Название", value: "name"},
        {text: "Описание", value: "description"},
        {text: "Курс", value: "course.name"},
        {text: "Тесты", value: "tests_count"},
        {text: "Дата создания", value: "created_at"},
        {text: "Действия", value: "actions"},
      ],
      tabs: [],
      lessons :[],
      createDialog: false,
      editDialog: false,
      name: '',
      description: '',
      saveLoading: false,
      editLoading: false,
      page: 1,
      totalPaginationLength: 0,
      courseId: this.$route.params.id,
      texts: [],
      editId: null
    }
  },
  methods: {
    getLessons() {
      this.loading = true;
      let url = `/lessons?search[course_id]=exact|${this.courseId}&relation[course]&relation[texts]&count[]=tests&page=${this.page}`;
      this.$http.get(url)
          .then(resp => {
            this.lessons = resp.data.data.data;
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
      this.description = item.description;
      this.texts = item.texts;
      this.editId = item.id;
    },
    close() {
      this.createDialog = false;
      this.editDialog = false;
      this.name = '';
      this.description = '';
      this.texts = [];
      this.editId = null;
    },
    save() {
      this.saveLoading = true;

      const {courseId, name, description, texts} = this;

      this.$http
          .post('lessons', {
            course_id: courseId,
            name,
            description,
            texts
          })
          .then(() => {
            this.getLessons();
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
      let item = this.lessons.find(v => v.id === this.editId);

      const {courseId, description, texts} = this;

      this.$http
          .put(`lessons/${item.id}`, {
            course_id: courseId,
            description,
            texts
          })
          .then(() => {
            this.getLessons();
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
    deleteLesson(id) {
      this.$http.delete(`/lessons/${id}`)
          .then(() => {
            this.getLessons();
          })
          .catch(err => {
            this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
            this.loading = false;
          })
    },
    addText() {
      this.texts.push({'title': '', 'content': ''});
    },
    paginate() {
      this.getLessons()
    }
  }
}
</script>

<style scoped>

</style>
