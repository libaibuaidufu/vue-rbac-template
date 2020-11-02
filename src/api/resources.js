import request from '@/utils/request'

export function resourcesList(params) {
  return request({
    url: '/vue-admin-template/resources',
    method: 'get',
    params: params
  })
}

export function resourcesCreate(data) {
  return request({
    url: '/vue-admin-template/resources',
    method: 'post',
    data
  })
}
export function resourcesUpdate(id, data) {
  return request({
    url: `/vue-admin-template/resources/${id}`,
    method: 'put',
    data
  })
}
export function resourcesDelete(data) {
  return request({
    url: '/vue-admin-template/resources',
    method: 'delete',
    data
  })
}
