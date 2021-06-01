import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import API from "@/api/api"

Vue.config.productionTip = false
Vue.prototype.$http = API;

Vue.use(require('vue-moment'));

import store from './store'
import router from './router'


new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app')
