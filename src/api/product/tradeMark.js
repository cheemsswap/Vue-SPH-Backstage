import request from '@/utils/request'

//获取品牌列表
//GET /admin/product/baseTrademark/{page}/{limit}
export function getProductBaseTrademarkList({ page, limit }) {
    return request({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get',
    })
}

//新增品牌
//POST /admin/product/baseTrademark/save
export function addBaseTrademark(data) {
    return request({
        url: `/admin/product/baseTrademark/save`,
        method: 'post',
        data: data
    })
}

//修改品牌
//PUT /admin/product/baseTrademark/update
export function updateBaseTrademark(data) {
    return request({
        url: `/admin/product/baseTrademark/update`,
        method: 'put',
        data: data
    })
}

//删除品牌
// DELETE /admin/product/baseTrademark/remove/{id}
export function removeBaseTrademark({ id }) {
    return request({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'delete'
    })
}
