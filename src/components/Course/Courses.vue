<template>
  <v-data-table
      :loading="loading"
      :headers="headers"
      :items="courses"
      hide-default-footer
      class="elevation-1"
      :items-per-page="20"
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
              Добавить курс
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Добавить курс</span>
            </v-card-title>

            <v-card-text>

              <v-text-field
                  v-model="name"
                  label="Название курса"
              ></v-text-field>
              <v-text-field
                  v-model="description"
                  label="Описание курса"
              ></v-text-field>

              <v-checkbox
                  v-model="is_publish"
                  label="Запустить на платформу"
              ></v-checkbox>

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
    <template v-slot:footer>
      <v-pagination v-model="page"
                    :length="totalPaginationLength"
                    @input="getCourses">

      </v-pagination>
    </template>
    <template v-slot:item.lessons_count="{ item }">
        <v-btn link :to="`/courses/${item.id}/lessons`">{{item.lessons_count}}</v-btn>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-dialog
          :retain-focus="false"
          v-model="editDialog"
          max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Редактировать курс</span>
          </v-card-title>

          <v-card-text>

            <v-textarea
                v-model="description"
                label="Описание курса"
            ></v-textarea>

            <v-checkbox
                v-model="is_publish"
                label="Запустить на платформу"
            ></v-checkbox>

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
      <v-btn class="red" @click="deleteCourse(item.id)"><v-icon>mdi-delete-forever</v-icon></v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Courses",
  mounted() {
    this.getCourses()
    this.$store.commit('changeHeaderName', {'name': 'Курсы'})
  },
  data() {
    return {
      loading: false,
      headers: [
        {text: "id", value: "id"},
        {text: "Название", value: "name"},
        {text: "Описание", value: "description"},
        {text: "Количество уроков", value: "lessons_count"},
        {text: "На плафторме", value: "is_publish"},
        {text: "Дата создания", value: "published_at"},
        {text: "Действия", value: "actions"},
      ],
      courses: [],
      createDialog: false,
      editDialog: false,
      name: '',
      is_publish: false,
      description: '',
      saveLoading: false,
      editLoading: false,
      page: 1,
      totalPaginationLength: 0,
      editId: null
    }
  },
  methods: {
    getCourses() {
      this.loading = true;
      this.$http.get('/courses?count[]=lessons&page=' + this.page)
          .then(resp => {
            this.courses = resp.data.data.data;
            this.totalPaginationLength = Math.ceil(resp.data.data.total / 20);
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
      this.is_publish = item.is_publish;
      this.editId = item.id;
    },
    close() {
      this.createDialog = false;
      this.editDialog = false;
      this.name = '';
      this.description = '';
      this.is_publish = false;
      this.editId = false;
    },
    save() {
      this.saveLoading = true;

      const {name, description, is_publish} = this;

      this.$http.post('courses', {
        name,
        description,
        is_publish
      });

      this.saveLoading = false;

      this.close();

      this.getCourses();
    },
    edit() {
      let item = this.courses.find(v => v.id === this.editId);
      this.editLoading = true;

      const {description, is_publish} = this;

      this.$http
          .put(`courses/${item.id}`, {
            description,
            is_publish
          })
          .then(() => {
            item.description = description;
            item.is_publish = is_publish;
          })
          .catch(err => {
            this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
            this.editLoading = false;
          });

      this.close()
    },
    deleteCourse(id) {
      this.$http.delete(`/courses/${id}`)
        .then(() => {
          this.getCourses();
        })
        .catch(err => {
          this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
          this.loading = false;
        })
    },
    paginate() {
      this.getCourses()
    }
  }
}
</script>

<style scoped>

</style>
