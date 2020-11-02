import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return false
//   }
// }

function hasPemissionByPath(roles, route, baseDir) {
  if (route.path) {
    if (baseDir) {
      console.log(roles, baseDir + '/' + route.path)
      console.log(roles.some(role => baseDir + '/' + route.path === role))
      return roles.some(role => baseDir + '/' + route.path === role)
    } else {
      console.log(roles, route.path)
      console.log(roles.some(role => route.path === role))
      return roles.some(role => route.path === role)
    }
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles, baseDir = '') {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPemissionByPath(roles, tmp, baseDir)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, tmp.path)
      }
      res.push(tmp)
    }
    // if (hasPermission(roles, tmp)) {
    //   if (tmp.children) {
    //     tmp.children = filterAsyncRoutes(tmp.children, roles)
    //   }
    //   res.push(tmp)
    // }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
