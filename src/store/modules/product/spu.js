import {
    reqgetspuInfoList,
    reqgetTrademarkList,
    reqgetbaseSaleAttrList,
    reqgetSpuById,
    reqgetspuImageList,
    reqsaveSpuInfo,
    requpdateSpuInfo,
    reqdeleteSpuInfo,
    reqspuSaleAttrList,
    reqattrInfoList,
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
    reqsaveSpuInfo({ commit }, req) {
        return new Promise((resolve, reject) => {
            reqsaveSpuInfo(req)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    requpdateSpuInfo({ commit }, req) {
        return new Promise((resolve, reject) => {
            requpdateSpuInfo(req)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    reqdeleteSpuInfo({ commit }, { spuId }) {
        return new Promise((resolve, reject) => {
            reqdeleteSpuInfo({ spuId })
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    reqspuSaleAttrList({ commit }, { spuId }) {
        return new Promise((resolve, reject) => {
            reqspuSaleAttrList({ spuId })
                .then(data => {
                    resolve(data.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    reqattrInfoList({ commit }, { category1Id, category2Id, category3Id }) {
        return new Promise((resolve, reject) => {
            reqattrInfoList({ category1Id, category2Id, category3Id })
                .then(data => {
                    resolve(data.data)
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