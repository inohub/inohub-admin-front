import Vue from 'vue';
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const AUTH_REQUEST = "AUTH_REQUEST";
const AUTH_ERROR = "AUTH_ERROR";
const AUTH_SUCCESS = "AUTH_SUCCESS";
// const AUTH_LOGOUT = "AUTH_LOGOUT";
// const USER_REQUEST = "USER_REQUEST";
// const USER_SUCCESS = "USER_SUCCESS";
// const USER_ERROR = "USER_ERROR";
const vuexStore = {
    state: {
        navigationDrawer: {
            miniVariant: false
        },
        token: localStorage.getItem("user-token") || "",
        authStatus: '',
        snackbar : {
            text : '',
            color : '',
        },
        headerComponentName: 'Главная'
    },
    getters: {
        isNdMiniVariant: state => {
            return state.navigationDrawer.miniVariant
        },
        isAuthenticated: state => !!state.token,
        authStatus: state => state.authStatus,
    },
    actions: {
        [AUTH_REQUEST]: ({commit}, user) => {
            return new Promise((resolve, reject) => {
                commit(AUTH_REQUEST)
                axios({url: 'http://api.inohub.kz/api/auth/login', data: user, method: 'POST'})
                    .then(resp => {
                        const token = resp.data.data.access_token;
                        console.log(resp);
                        localStorage.setItem('user-token', token)
                        commit(AUTH_SUCCESS, token);
                        commit('toggleSnackbar', {color:'success', text: 'Successfully logged in!'});
                        //dispatch(USER_REQUEST);
                        resolve(resp)
                    })
                    .catch(err => {
                        commit(AUTH_ERROR, err)
                        localStorage.removeItem('user-token')
                        commit('toggleSnackbar', {color : 'error', text : 'Wrong data or forbidden!'})
                        reject(err)
                    })

            })
        }
    },
    mutations: {
        toggleNdMiniVariant(state) {
            state.navigationDrawer.miniVariant = !state.navigationDrawer.miniVariant;
        },

        [AUTH_REQUEST]: (state) => {
            state.status = 'loading'
        },
        [AUTH_SUCCESS]: (state, token) => {
            state.status = 'success'
            state.token = token
        },
        [AUTH_ERROR] : (state) => {
            state.status = 'error'
        },
        toggleSnackbar(state, payload) {
            state.snackbar.text = payload.text;
            state.snackbar.color = payload.color;
        },
        changeHeaderName(state, payload) {
            state.headerComponentName = payload.name;
        }
    }
}

const store = new Vuex.Store(vuexStore);


export default store
