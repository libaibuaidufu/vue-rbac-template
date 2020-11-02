<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="角色"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAddrolemenu"
      >
        新增
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
    </div>
    <el-table
      :data="rolemenusList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getrolemenus"
    />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit rolemenumenu':'New rolemenumenu'">
      <el-form :model="rolemenumenu" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="rolemenumenu.name" placeholder="rolemenumenu Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="rolemenumenu.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="rolemenumenu Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmrolemenu">Confirm</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import path from 'path'
import { rolemenuList, rolemenuCreate, rolemenuUpdate, rolemenuDelete } from '@/api/rolemenu'
import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { asyncRoutes } from '@/router/index'
const defaultrolemenu = {
  key: '',
  name: '',
  description: '',
  routes: []
}
export default {
  name: 'Rolemenu',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        sort: '+id'
      },
      rolemenumenu: Object.assign({}, defaultrolemenu),
      routes: [],
      rolemenusList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and rolemenus list from server
    this.getRoutes()
    this.getrolemenus()
  },
  methods: {
    async getRoutes() {
      // const res = await menuList()
      // console.log(res)
      // this.serviceRoutes = res.data.data
      // this.routes = this.generateRoutes(res.data.data)
      this.serviceRoutes = asyncRoutes
      this.routes = this.generateRoutes(asyncRoutes)
    },
    async getrolemenus() {
      const res = await rolemenuList(this.listQuery)
      this.rolemenusList = res.data.data
      this.total = res.data.total
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title || route.name

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      console.log(data)
      return data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAddrolemenu() {
      this.rolemenumenu = Object.assign({}, defaultrolemenu)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.rolemenumenu = deepClone(scope.row)
      console.log(this.rolemenumenu)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.rolemenumenu.routes)
        console.log(routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the rolemenumenu?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await rolemenuDelete(row.id)
          this.rolemenusList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmrolemenu() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.rolemenumenu.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      if (isEdit) {
        await rolemenuUpdate(this.rolemenumenu.key, this.rolemenumenu)
        for (let index = 0; index < this.rolemenusList.length; index++) {
          if (this.rolemenusList[index].key === this.rolemenumenu.key) {
            this.rolemenusList.splice(index, 1, Object.assign({}, this.rolemenumenu))
            break
          }
        }
      } else {
        const { data } = await rolemenuCreate(this.rolemenumenu)
        this.rolemenumenu.key = data.key
        this.rolemenusList.push(this.rolemenumenu)
      }

      const { description, key, name } = this.rolemenumenu
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>rolemenumenu Key: ${key}</div>
            <div>rolemenumenu Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        console.log(parent.path, onlyOneChild.path)
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .rolemenus-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

