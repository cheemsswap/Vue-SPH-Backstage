import { addBaseTrademark, getProductBaseTrademarkList } from '@/api/product/tradeMark'


const getDefaultState = () => {
    return {
        currentPageData: []
    }
}

const state = getDefaultState()

const mutations = {
    SET_CURRENTPAGEDATA(state, currentPageData) {
        state.currentPageData = currentPageData
    }
}

const actions = {
    getProductBaseTrademarkList({ commit }, { page, limit }) {
        return new Promise((resolve, reject) => {
            getProductBaseTrademarkList({ page, limit }).then(response => {
                const { data } = response
                commit('SET_CURRENTPAGEDATA', data)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    addBaseTrademark({ commit }, { tmName, logoUrl }) {
        return new Promise((resolve, reject) => {
            addBaseTrademark({ tmName, logoUrl }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}