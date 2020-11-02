<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.admin_name"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.admin_status"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
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
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.admin_name }}
        </template>
      </el-table-column>
      <el-table-column label="实名" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.admin_real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户电话" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.admin_telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户邮箱" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.admin_email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="状态"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.admin_status | statusFilter">{{
            statusMap[scope.row.admin_status + ""]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="用户创建时间"
        width="250"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.admin_add_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="user"
        label-position="left"
        label-width="70px"
        style="width: 660px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="admin_name">
          <el-input v-model="user.admin_name" />
        </el-form-item>
        <el-form-item label="实名" prop="admin_real_name">
          <el-input v-model="user.admin_real_name" />
        </el-form-item>
        <el-form-item label="电话" prop="admin_telephone">
          <el-input v-model="user.admin_telephone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="admin_email">
          <el-input v-model="user.admin_email" />
        </el-form-item>
        <el-form-item label="密码" prop="admin_password">
          <el-input v-model="user.admin_password" show-password />
        </el-form-item>
        <el-form-item label="员工" prop="admin_is_staff">
          <template>
            <el-radio v-model="user.admin_is_staff" :label="true">是</el-radio>
            <el-radio v-model="user.admin_is_staff" :label="false">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="超级管理员" prop="admin_is_super">
          <template>
            <el-radio v-model="user.admin_is_super" :label="true">是</el-radio>
            <el-radio v-model="user.admin_is_super" :label="false">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="user.admin_status"
            class="filter-item"
            placeholder="选择状态"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="admin_desc">
          <el-input v-model="user.admin_desc" />
        </el-form-item>
        <el-form-item label="角色菜单" prop="user_role">
          <el-select v-model="user.user_rolemenu" multiple placeholder="请选择">
            <el-option
              v-for="item in rolemenuOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="user_role">
          <el-select v-model="user.user_role" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户组" prop="user_group">
          <el-select v-model="user.user_group" multiple placeholder="请选择">
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="user_resources">
          <el-transfer v-model="user.user_resources" :data="resourcesOptions" :titles="['所有权限', '已选权限']">
            <el-button slot="left-footer" class="transfer-footer" size="small" @click="selectAll">选择全部</el-button>
            <el-button slot="right-footer" class="transfer-footer" size="small" @click="deleteAll">删除全部</el-button>
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, userCreate, userUpdate, userDelete } from '@/api/user'
import { groupList } from '@/api/group'
import { resourcesList } from '@/api/resources'
import { roleList } from '@/api/role'
import { rolemenuList } from '@/api/rolemenu'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: 1, display_name: '正常' },
  { key: 0, display_name: '禁用' },
  { key: -1, display_name: '删除' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'User',
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'gray',
        '-1': 'danger'
      }
      return statusMap[status + '']
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        admin_name: undefined,
        admin_telephone: undefined,
        admin_status: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      user: {
        admin_name: undefined,
        admin_password: undefined
      },
      rules: {
        admin_name: [{ required: true, message: 'username is required', trigger: 'change' }],
        admin_password: [{ required: true, message: 'password is required', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      statusMap: {
        '1': '正常',
        '0': '禁用',
        '-1': '删除'
      },
      downloadLoading: false,
      roleOptions: [],
      rolemenuOptions: [],
      groupOptions: [],
      resourcesOptions: []
    }
  },
  created() {
    this.getList()
    this.getGroup()
    this.getResources()
    this.getRole()
    this.getRolemenu()
  },
  methods: {
    async getList() {
      userList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
      })
    },
    async getGroup() {
      const res = await groupList()
      const group_options = []
      for (let i = 0; i < res.data.data.length; i++) {
        group_options.push({
          value: res.data.data[i].id,
          label: res.data.data[i].name
        })
      }
      this.groupOptions = group_options
    },
    async getResources() {
      const { data } = await resourcesList({})
      for (let i = 0; i < data.data.length; i++) {
        this.resourcesOptions.push(
          {
            'key': data.data[i].id,
            'label': data.data[i].name
          }
        )
      }
    },
    async getRole() {
      const res = await roleList()
      this.roleOptions = res.data.data
    },
    async getRolemenu() {
      const res = await rolemenuList()
      this.rolemenuOptions = res.data.data
    },
    resetTemp() {
      this.user = {
        admin_name: undefined,
        admin_password: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          userCreate(this.user).then(() => {
            this.list.unshift(this.user)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.user = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.user)
          userUpdate(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.user.id)
            this.list.splice(index, 1, this.user)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.list.splice(index, 1)
      const tempData = { id: row.id }
      userDelete(tempData).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '实名', '状态', '手机号', '邮箱']
        const filterVal = ['admin_name', 'admin_real_name', 'admin_status', 'admin_telephone', 'admin_email']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    selectAll() {
      const resources_list = []
      for (let i = 0; i < this.data.length; i++) {
        resources_list.push(this.data[i].key)
      }
      this.group.resources_list = resources_list
    },
    deleteAll() {
      this.group.resources_list = []
    }
  }
}
</script>
