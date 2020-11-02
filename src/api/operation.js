import request from '@/utils/request'

export function operationList(params) {
  return request({
    url: '/vue-admin-template/operation',
    method: 'get',
    params: params
  })
}

export function operationCreate(data) {
  return request({
    url: '/vue-admin-template/operation',
    method: 'post',
    data
  })
}
export function operationUpdate(data) {
  return request({
    url: '/vue-admin-template/operation/_update',
    method: 'post',
    data
  })
}
export function operationDelete(data) {
  return request({
    url: '/vue-admin-template/operation/_delete',
    method: 'post',
    data
  })
}
