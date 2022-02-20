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

//添加 SPU
//POST /admin/product/saveSpuInfo
export function reqsaveSpuInfo(req) {
    return request({
        method: "post",
        url: `/admin/product/saveSpuInfo`,
        data: req
    })
}

//修改 SPU
// POST /admin/product/updateSpuInfo
export function requpdateSpuInfo(req) {
    return request({
        method: "post",
        url: `/admin/product/updateSpuInfo`,
        data: req
    })
}

//删除 SPU
// DELETE /admin/product/deleteSpu/{spuId}
export function reqdeleteSpuInfo({ spuId }) {
    return request({
        method: "delete",
        url: `/admin/product/deleteSpu/${spuId}`,
    })
}

//获取指定SPU的销售属性数据
// GET /admin/product/spuSaleAttrList/{spuId}
export function reqspuSaleAttrList({ spuId }) {
    return request({
        method: "get",
        url: `/admin/product/spuSaleAttrList/${spuId}`,
    })
}

//获取平台属性数据
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export function reqattrInfoList({ category1Id, category2Id, category3Id }) {
    return request({
        method: "get",
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    })
}

//保存Sku信息
// POST /admin/product/saveSkuInfo
export function reqsaveSkuInfo(req) {
    return request({
        method: "post",
        url: `/admin/product/saveSkuInfo`,
        data: req
    })
}

//获取SKU列表信息
// GET /admin/product/findBySpuId/{spuId}
export function reqfindBySpuId({ spuId }) {
    return request({
        method: "get",
        url: `/admin/product/findBySpuId/${spuId}`,
    })
}

