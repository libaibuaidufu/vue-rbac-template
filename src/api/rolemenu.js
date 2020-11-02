import request from '@/utils/request'

export function rolemenuList(params) {
  return request({
    url: '/vue-admin-template/rolemenu',
    method: 'get',
    params: params
  })
}

export function rolemenuCreate(data) {
  return request({
    url: '/vue-admin-template/rolemenu',
    method: 'post',
    data
  })
}
export function rolemenuUpdate(id, data) {
  return request({
    url: `/vue-admin-template/rolemenu/${id}`,
    method: 'put',
    data
  })
}
export function rolemenuDelete(data) {
  return request({
    url: '/vue-admin-template/rolemenu',
    method: 'delete',
    data
  })
}
