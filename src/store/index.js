import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import trademark from './modules/product/tradeMark'
import attr from './modules/product/attr'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    trademark,
    attr
  },
  getters
})

export default store
