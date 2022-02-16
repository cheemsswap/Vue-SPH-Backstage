import {
    reqgetCategory1,
    reqgetCategory2,
    reqgetCategory3,
    reqgetattrInfoList,
    reqsaveattrInfo,
    reqdelattrInfo
} from '@/api/product/attr'


const getDefaultState = () => {
    return {

    }
}

const state = getDefaultState()

const mutations = {
}

const actions = {
    reqgetCategory1({ commit }) {
        return new Promise((resolve, reject) => {
            reqgetCategory1().then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    reqgetCategory2({ commit }, { category1Id }) {
        return new Promise((resolve, reject) => {
            reqgetCategory2({ category1Id }).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    reqgetCategory3({ commit }, { category2Id }) {
        return new Promise((resolve, reject) => {
            reqgetCategory3({ category2Id }).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    reqgetattrInfoList({ commit }, { category1Id, category2Id, category3Id }) {
        return new Promise((resolve, reject) => {
            reqgetattrInfoList({ category1Id, category2Id, category3Id })
                .then(response => {
                    resolve(response.data)
                }).catch(error => {
                    reject(error)
                })
        })
    },
    reqsaveattrInfo({ commit }, req) {
        return new Promise((resolve, reject) => {
            reqsaveattrInfo(req)
                .then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
        })
    },
    reqdelattrInfo({ commit }, { attrId }) {
        return new Promise((resolve, reject) => {
            reqdelattrInfo({ attrId })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
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