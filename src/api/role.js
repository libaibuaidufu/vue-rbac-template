import request from '@/utils/request'

export function roleList(params) {
  return request({
    url: '/vue-admin-template/role',
    method: 'get',
    params: params
  })
}

export function roleCreate(data) {
  console.log(data)
  return request({
    url: '/vue-admin-template/role',
    method: 'post',
    data
  })
}
export function roleUpdate(id, data) {
  console.log(id)
  console.log(data)
  return request({
    url: `/vue-admin-template/role/_update/${id}`,
    method: 'post',
    data
  })
}
export function roleDelete(id) {
  return request({
    url: `/vue-admin-template/role/_delete/${id}`,
    method: 'post'
  })
}
