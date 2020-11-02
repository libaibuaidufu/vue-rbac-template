import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfos(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function getInfo() {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function userList(params) {
  return request({
    url: '/vue-admin-template/user',
    method: 'get',
    params: params
  })
}

export function userCreate(data) {
  return request({
    url: '/vue-admin-template/user/register',
    method: 'post',
    data
  })
}

export function userUpdate(data) {
  return request({
    url: '/vue-admin-template/user/_update',
    method: 'post',
    data
  })
}

export function userDelete(data) {
  return request({
    url: '/vue-admin-template/user/_delete',
    method: 'post',
    data
  })
}
