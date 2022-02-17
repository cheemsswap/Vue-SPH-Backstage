import request from '@/utils/request'

//获取SPU列表
// GET /admin/product/{page}/{limit}
export function reqgetspuInfoList({ page, limit, req }) {
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: "get",
        params: req
    })
}

//获取品牌列表
// GET /admin/product/baseTrademark/getTrademarkList
export function reqgetTrademarkList() {
    return request({
        url: `/admin/product/baseTrademark/getTrademarkList`,
        method: "get"
    })
}

//获取基本销售属性
// GET /admin/product/baseSaleAttrList
export function reqgetbaseSaleAttrList() {
    return request({
        url: `/admin/product/baseSaleAttrList`,
        method: "get"
    })
}

//获取SPU基本信息
// GET /admin/product/getSpuById/{spuId}
export function reqgetSpuById({ spuId }) {
    return request({
        url: `/admin/product/getSpuById/${spuId}`,
        method: "get"
    })
}

//获取SPU图片
//GET /admin/product/spuImageList/{spuId}
export function reqgetspuImageList({ spuId }) {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: "get"
    })
}
