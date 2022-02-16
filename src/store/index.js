import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import trademark from './modules/product/tradeMark'
import attr from './modules/product/attr'
import spu from './modules/product/spu'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    trademark,
    attr,
    spu
  },
  getters
})

export default store
