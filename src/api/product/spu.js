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