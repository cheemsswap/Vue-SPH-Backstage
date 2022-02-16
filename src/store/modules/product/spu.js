import {
    reqgetspuInfoList
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
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}