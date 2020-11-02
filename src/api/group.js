import request from '@/utils/request'

export function groupList(params) {
  return request({
    url: '/vue-admin-template/group',
    method: 'get',
    params: params
  })
}

export function groupCreate(data) {
  return request({
    url: '/vue-admin-template/group',
    method: 'post',
    data
  })
}
export function groupUpdate(id, data) {
  return request({
    url: `/vue-admin-template/group/${id}`,
    method: 'put',
    data
  })
}
export function groupDelete(data) {
  return request({
    url: '/vue-admin-template/group',
    method: 'delete',
    data
  })
}
