import request from '@/utils/request'


//获取一级分类
//GET /admin/product/get/category1
export function reqgetCategory1() {
    return request({
        url: `/admin/product/getCategory1`,
        method: 'get',
    })
}

//获取二级分类
//GET /admin/product/getCategory2/{category1Id}
export function reqgetCategory2({ category1Id }) {
    return request({
        url: `/admin/product/getCategory2/${category1Id}`,
        method: 'get',
    })
}

//获取三级分类
//GET /admin/product/getCategory3/{category2Id}
export function reqgetCategory3({ category2Id }) {
    return request({
        url: `/admin/product/getCategory3/${category2Id}`,
        method: 'get',
    })
}

// 商品基础属性接口
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export function reqgetattrInfoList({ category1Id, category2Id, category3Id }) {
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get',
    })
}

//新增or修改商品属性
//POST /admin/product/saveAttrInfo
export function reqsaveattrInfo(req) {
    return request({
        url: `/admin/product/saveAttrInfo`,
        method: 'post',
        data: req
    })
}

//删除商品属性
//DELETE /admin/product/deleteAttr/{attrId}
export function reqdelattrInfo({ attrId }) {
    return request({
        url: `/admin/product/deleteAttr/${attrId}`,
        method: 'delete'
    })
}
