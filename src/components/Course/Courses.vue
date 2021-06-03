<template>
  <v-data-table
      :loading="loading"
      :headers="headers"
      :items="courses"
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
        <!--        <v-dialog v-model="dialogDelete" max-width="500px">-->
        <!--          <v-card>-->
        <!--            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>-->
        <!--            <v-card-actions>-->
        <!--              <v-spacer></v-spacer>-->
        <!--              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>-->
        <!--              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>-->
        <!--              <v-spacer></v-spacer>-->
        <!--            </v-card-actions>-->
        <!--          </v-card>-->
        <!--        </v-dialog>-->
      </v-toolbar>
    </template>
    <template v-slot:footer>
      <v-pagination v-model="page"
                    :length="totalPaginationLength"
                    @input="getCourses">

      </v-pagination>
    </template>
    <template v-slot:item.lessons_count="{ item }">
        <v-btn link :to="'/courses/'+item.id+'/lessons'">{{item.lessons_count}}</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Courses",
  mounted() {
    this.getCourses()
    this.$store.commit('changeHeaderName', {'name': 'Курсы'})
    console.log('courses')
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
      name: '',
      is_publish: false,
      description: '',
      saveLoading: false,
      page: 1,
      totalPaginationLength: 0
    }
  },
  methods: {
    getCourses() {
      this.loading = true;
      console.log('lol')
      this.$http.get('/courses?count[]=lessons&page=' + this.page)
          .then(resp => {
            this.courses = resp.data.data.data;
            this.totalPaginationLength = resp.data.data.last_page
            this.loading = false;
          })
          .catch(err => {
            this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
            this.loading = false;
          })
    },
    close() {
      this.createDialog = false
    },
    save() {
      this.saveLoading = true;

      const {name, description, is_publish} = this;

      this.$http.post('courses', {
        name,
        description,
        is_publish
      })
      this.close()
    },
    paginate() {
      console.log('lol')
      this.getCourses()
    }
  }
}
</script>

<style scoped>

</style>
