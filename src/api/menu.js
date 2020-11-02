import request from '@/utils/request'

export function menuList(params) {
  return request({
    url: '/vue-admin-template/menu',
    method: 'get',
    params: params
  })
}

export function menuCreate(data) {
  return request({
    url: '/vue-admin-template/menu',
    method: 'post',
    data
  })
}
export function menuUpdate(data) {
  return request({
    url: '/vue-admin-template/menu/_update',
    method: 'post',
    data
  })
}
export function menuDelete(data) {
  return request({
    url: '/vue-admin-template/menu/_delete',
    method: 'post',
    data
  })
}
