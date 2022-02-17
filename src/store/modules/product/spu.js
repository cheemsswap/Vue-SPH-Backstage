import {
    reqgetspuInfoList,
    reqgetTrademarkList,
    reqgetbaseSaleAttrList,
    reqgetSpuById,
    reqgetspuImageList
} from '@/api/product/spu'


const getDefaultState = () => {
    return {

    }
}

const state = getDefaultState()

const mutations = {

}

const actions = {
    reqgetspuInfoList({ commit }, { page, limit, req }) {
        return new Promise((resolve, reject) => {
            reqgetspuInfoList({ page, limit, req })
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    reqgetTrademarkList({ commit }) {
        return new Promise((resolve, reject) => {
            reqgetTrademarkList()
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    reqgetbaseSaleAttrList({ commit }) {
        return new Promise((resolve, reject) => {
            reqgetbaseSaleAttrList()
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    reqgetSpuById({ commit }, { spuId }) {
        return new Promise((resolve, reject) => {
            reqgetSpuById({ spuId })
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    reqgetspuImageList({ commit }, { spuId }) {
        return new Promise((resolve, reject) => {
            reqgetspuImageList({ spuId })
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}