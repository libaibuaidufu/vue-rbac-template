import request from '@/utils/request'

export function pemissionList(params) {
  return request({
    url: '/vue-admin-template/pemission',
    method: 'get',
    params: params
  })
}

export function pemissionCreate(data) {
  return request({
    url: '/vue-admin-template/pemission',
    method: 'post',
    data
  })
}
export function pemissionUpdate(data) {
  return request({
    url: '/vue-admin-template/pemission/_update',
    method: 'post',
    data
  })
}
export function pemissionDelete(data) {
  return request({
    url: '/vue-admin-template/pemission/_delete',
    method: 'post',
    data
  })
}
