<template>
  <v-data-table
      :loading="loading"
      :headers="headers"
      :items="questions"
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
              Добавить вопрос
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Добавить вопрос</span>
            </v-card-title>

            <v-card-text>

              <v-text-field
                  v-model="text"
                  label="Вопрос"
              ></v-text-field>

              <v-select
                  item-text="label"
                  item-value="key"
                  :items="types"
                  v-model="type"
                  @change="typeChanged"
                  label="Тип ответа"
              ></v-select>

              <v-list v-if="variants.length">
                <v-subheader>Варианты</v-subheader>
                <v-list-item v-for="(item, index) in variants" :key="index">
                  <v-card-text>
                    <v-text-field
                        v-model="item.text"
                        label="Текст ответа"
                    ></v-text-field>
                    <v-select
                        item-text="label"
                        item-value="key"
                        :items="isCorrectTypes"
                        v-model="item.is_correct"
                        label="Правильность"
                    ></v-select>
                    <v-btn class="red" @click="deleteVariant(index)">
                      <v-icon>mdi-delete-forever</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-list-item>
              </v-list>

              <v-textarea v-if="type === 'answer'" v-model="answer" label="Текст ответа"></v-textarea>

            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  v-if="type === 'variants'"
                  color="blue darken-1"
                  text
                  @click="addVariant"
              >
                Добавить вариант
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
    <template v-slot:item.actions="{ item }">
      <v-dialog
          :retain-focus="false"
          v-model="editDialog"
          max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Редактировать вопрос</span>
          </v-card-title>

          <v-card-text>

            <v-textarea
                v-model="text"
                label="Вопрос"
            ></v-textarea>

            <v-textarea v-if="type === 'answer'" v-model="editAnswer" label="Текст ответа"></v-textarea>

            <v-list v-if="variants.length">
              <v-subheader>Варианты</v-subheader>
              <v-list-item v-for="(item, index) in variants" :key="index">
                <v-card-text>
                  <v-text-field
                      v-model="item.text"
                      label="Текст ответа"
                  ></v-text-field>
                  <v-select
                      item-text="label"
                      item-value="key"
                      :items="isCorrectTypes"
                      v-model="item.is_correct"
                      label="Правильность"
                  ></v-select>
                  <v-btn class="red" @click="deleteVariant(index)">
                    <v-icon>mdi-delete-forever</v-icon>
                  </v-btn>
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
      <v-btn class="red" @click="deleteQuestion(item.id)"><v-icon>mdi-delete-forever</v-icon></v-btn>
    </template>
    <template v-slot:footer>
      <v-pagination v-model="page"
                    :length="totalPaginationLength"
                    @input="getQuestions()">

      </v-pagination>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Questions",
  mounted() {
    this.getQuestions()
    this.$store.commit('changeHeaderName', {'name': 'Вопросы'})
  },
  data() {
    return {
      loading: false,
      headers: [
        {text: "id", value: "id"},
        {text: "Вопрос", value: "text"},
        {text: "Название теста", value: "test.name"},
        {text: "Дата создания", value: "created_at"},
        {text: "Действия", value: "actions"},
      ],
      tabs: [],
      questions :[],
      createDialog: false,
      editDialog: false,
      text: '',
      saveLoading: false,
      editLoading: false,
      page: 1,
      totalPaginationLength: 0,
      testId: this.$route.params.id,
      editId: null,
      answer: null,
      editAnswer: null,
      variants: [],
      type: null,
      types: [{'key': 'answer', 'label': 'Открытый вопрос'}, {'key': 'variants', 'label': 'Вопрос с множественным выбором'}],
      isCorrectTypes: [{'key': 1, 'label': 'Правильно'}, {'key': 0, 'label': 'Не правильно'}]
    }
  },
  methods: {
    getQuestions() {
      this.loading = true;
      let url = `/questions?search[test_id]=exact|${this.testId}&relation[test]&relation[answer]&relation[variants]&page=${this.page}`;
      this.$http.get(url)
          .then(resp => {
            this.questions = resp.data.data.data;
            this.totalPaginationLength = Math.floor(resp.data.data.total / 20);
            this.loading = false;
          })
          .catch(err => {
            this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
            this.loading = false;
          })
    },
    typeChanged() {
        this.answer = null;
        this.variants = [];
    },
    openEditDialog(item) {
      this.editDialog = true;
      this.text = item.text;
      this.editId = item.id;
      if (item.answer) {
        this.type = 'answer';
        this.answer = item.answer;
        this.editAnswer = item.answer.correct_text;
      } else if (item.variants) {
        this.type = 'variants';
        this.variants = item.variants;
        console.log(this.variants);
      }

    },
    close() {
      this.createDialog = false;
      this.editDialog = false;
      this.text = '';
      this.answer = null;
      this.editAnswer = null;
      this.variants = [];
      this.editId = null;
      this.type = null;
    },
    save() {
      this.saveLoading = true;

      const {testId, text, answer, variants, type} = this;

      if (!answer && !variants.length) {
        this.$store.commit('toggleSnackbar', {text: 'You have to add an answer', color: "error"})
        this.saveLoading = false;
        return;
      }

      let question = null;

      this.$http
          .post('questions', {
            test_id: testId,
            text
          })
          .then(response => {
            question = response.data.data;

            if (type === 'answer') {
              this.$http
                  .post('answers', {
                    question_id: question.id,
                    correct_text: answer
                  })
                  .then(() => {
                    this.getQuestions();
                    this.saveLoading = false;
                  })
                  .catch(err => {
                    let errors = err.response.data.data;
                    let keys = Object.keys(errors);
                    keys.forEach(key => {
                      this.$store.commit('toggleSnackbar', {text: errors[key][0], color: "error"});
                    });
                    this.deleteQuestion(question.id);
                    this.saveLoading = false;
                  });
            } else {
              variants.forEach(variant => {
                this.$http
                    .post('variants', {
                      question_id: question.id,
                      text: variant.text,
                      is_correct: variant.is_correct
                    })
                    .then(() => {
                      this.getQuestions();
                    })
                    .catch(err => {
                      let errors = err.response.data.data;
                      let keys = Object.keys(errors);
                      keys.forEach(key => {
                        this.$store.commit('toggleSnackbar', {text: errors[key][0], color: "error"});
                      });
                      this.deleteQuestion(question.id);
                      this.saveLoading = false;
                      return;
                    });
              });
            }
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
      let item = this.questions.find(v => v.id === this.editId);

      const {text, answer, variants, editAnswer} = this;

      if (!editAnswer && !variants.length) {
        this.$store.commit('toggleSnackbar', {text: 'You have to add an answer', color: "error"})
        this.saveLoading = false;
        return;
      }

      this.$http
          .put(`questions/${item.id}`, {
            text
          })
          .then(() => {
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

      if (this.type === 'answer') {
        this.$http.delete(`answers/${answer.id}`).then(() => {
          this.$http
              .post('answers', {
                question_id: item.id,
                correct_text: editAnswer
              })
              .then(() => {
                this.getQuestions();
                this.editLoading = false;
              })
              .catch(err => {
                let errors = err.response.data.data;
                let keys = Object.keys(errors);
                keys.forEach(key => {
                  this.$store.commit('toggleSnackbar', {text: errors[key][0], color: "error"});
                });
                this.deleteQuestion(item.id);
                this.editLoading = false;
              });
        });
      } else {
        variants.forEach(variant => {
          this.$http.delete(`variants/${variant.id}`);
        });

        console.log(variants);
        variants.forEach(variant => {
          this.$http
              .post('variants', {
                question_id: item.id,
                text: variant.text,
                is_correct: variant.is_correct
              })
              .then(() => {
                this.getQuestions();
              })
              .catch(err => {
                let errors = err.response.data.data;
                let keys = Object.keys(errors);
                keys.forEach(key => {
                  this.$store.commit('toggleSnackbar', {text: errors[key][0], color: "error"});
                });
                this.deleteQuestion(item.id);
                this.saveLoading = false;
                return;
              });
        });
      }

      this.close();
    },
    deleteQuestion(id) {
      this.$http.delete(`/questions/${id}`)
          .then(() => {
            this.getQuestions();
          })
          .catch(err => {
            this.$store.commit('toggleSnackbar', {text: err.message, color: "error"})
            this.loading = false;
          })
    },
    addVariant() {
      this.variants.push({'text': '', 'is_correct': 0})
    },
    deleteVariant(index) {
      this.variants.splice(index, 1);
    },
    paginate() {
      this.getQuestions()
    }
  }
}
</script>

<style scoped>

</style>
