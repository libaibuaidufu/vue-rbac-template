<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="用户组"
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
        @click="handleCreate"
      >
        新增
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
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
      <el-table-column label="用户组" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
        :model="group"
        label-position="left"
        label-width="70px"
        style="width: 660px; margin-left:50px;"
      >
        <el-form-item label="用户组" prop="name">
          <el-input v-model="group.name" />
        </el-form-item>
        <el-form-item label="权限" prop="resources_list">
          <el-transfer v-model="group.resources_list" :data="data" :titles="['所有权限', '已选权限']">
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
import { groupList, groupCreate, groupUpdate, groupDelete } from '@/api/group'
import { resourcesList } from '@/api/resources'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
const defaultGroup = {
  name: '',
  resources_list: []
}
export default {
  name: 'Group',
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
        name: undefined,
        sort: '+id'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      group: Object.assign({}, defaultGroup),
      data: [],
      rules: {
        name: [{ required: true, message: '用户组 is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getResources()
  },
  methods: {
    async getResources() {
      console.log('in')
      const { data } = await resourcesList({})
      console.log(data)
      for (let i = 0; i < data.data.length; i++) {
        this.data.push(
          {
            'key': data.data[i].id,
            'label': data.data[i].name
          }
        )
      }
    },
    async getList() {
      groupList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
      })
    },
    resetTemp() {
      this.group = Object.assign({}, defaultGroup)
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
          groupCreate(this.group).then(() => {
            this.list.unshift(this.group)
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
      this.group = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.group)
          groupUpdate(tempData.id, tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.group.id)
            this.list.splice(index, 1, this.group)
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
      groupDelete(tempData).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
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
