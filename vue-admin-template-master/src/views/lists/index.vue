<template>
  <div class="app-container">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="auto">
        <template slot-scope="scope">
          {{ scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="password" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="age" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="grender" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="avr" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.avr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="uid" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="operation" width="auto" align="center">
        <template slot-scope="scope">
          <span style="font-size:22px;">
            <i class="el-icon-edit" title="修改" @click="editUserShow(scope)"/>&nbsp;
            <i class="el-icon-circle-close" title="删除" @click="delUserShow(scope)"/>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="姓名：" @dragDialog="handleDrag">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="password">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="age">
          <el-input v-model="form.age" />
        </el-form-item>
        <el-form-item label="grender">
          <el-select v-model="form.grender" placeholder="please select your zone">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="avr">
           <!-- <pan-thumb :image="image" class="avatar" /> -->
            <el-button type="primary" icon="el-icon-upload" style="margin:0 0 -50px 10px;" @click="imagecropperShow=true">
              Change Avatar
            </el-button>
            <!-- <image-cropper
              v-show="imagecropperShow"
              :key="imagecropperKey"
              :width="300"
              :height="300"
              url="https://httpbin.org/post"
              lang-type="en"
              @close="close"
              @crop-upload-success="cropSuccess"
            /> -->
        </el-form-item>
       
        <el-form-item label="uid">
          <el-select v-model="form.region" placeholder="please select your zone">
            <el-option label="0" value="0" />
            <el-option label="1" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="Instant delivery">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editUser()">Create</el-button>
          <el-button @click="dialogTableVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 增加按钮弹出层 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="addUser" label-position="left" label-width="80px" style="width: 500px; margin-left:50px;">
        <el-form-item label="name" prop="name">
          <el-input v-model="addUser.name" />
        </el-form-item>
        <el-form-item label="password" >
          <el-input v-model="addUser.password" />
        </el-form-item>
        <el-form-item label="age" >
          <el-input v-model="addUser.age" />
        </el-form-item>
        <el-form-item label="grender" >
          <el-select v-model="addUser.grender" class="filter-item" placeholder="Please select">
            <el-option v-for="item in grender" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="avr" >
          <el-input v-model="addUser.avr" />
        </el-form-item>
        <el-form-item label="uid" >
          <el-select v-model="addUser.uid" class="filter-item" placeholder="Please select">
            <el-option v-for="item in uid" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
       
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createUser():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

     <!-- 增加按钮弹出层 -->
    <el-dialog title="是否确认删除?" :visible.sync="dialogDelUserVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="delUser()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  directives: { elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: { ImageCropper, PanThumb },
  data() {
    return {
      
      grender: ['男','女'],
      uid:[],
      addUser: {
        name: '',
        password: '',
        age: '',
        grender: '',
        avr: '',
        uid: '',
        timestamp: new Date(),
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
     form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      dialogTableVisible: false,
      list: null,
      listLoading: true,
      dialogDelUserVisible:false,
      delUserId:0,
      editUserId:0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    editUser(){
      console.log(this.form)
      this.axios.post('http://127.0.0.1:9000/api/user/editUser',this.$qs.stringify(this.form))
        .then( (response) => {
          console.log(response);
          // this.list = response.data;
          // this.listLoading = false;
          this.dialogTableVisible = false
           this.fetchData()
        })
        .catch(function (error) {
          console.log(error,111);
        });
    },
    editUserShow(date){
      this.editUserId = date.row.id 
      this.axios.get('http://127.0.0.1:9000/api/user/getUser/' + this.editUserId )
        .then( (response) => {
          console.log(response);
          this.form = response.data[0]
          this.dialogTableVisible = true
           this.fetchData()
        })
        .catch(function (error) {
          console.log(error);
        });

       
    },
    delUserShow(date) {
      console.log(date)
      this.delUserId = date.row.id 
      this.dialogDelUserVisible = true
    },
    delUser(){
      this.axios.get('http://127.0.0.1:9000/api/user/deleteUser/' + this.delUserId )
        .then( (response) => {
          // console.log(response.data);
          this.list = response.data;
          this.dialogDelUserVisible = false
           this.fetchData()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    createUser() {
     
      var params = this.addUser;
     
      this.axios.post('http://127.0.0.1:9000/api/user/addUser',this.$qs.stringify(params))
        .then( (response) => {
          console.log(response.data);
          // this.list = response.data;
          // this.listLoading = false;
          this.dialogFormVisible = false
           this.fetchData()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleCreate() {
      
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })

    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleDrag() {
      this.$refs.select.blur()
    },
    fetchData() {
      this.listLoading = true

      // 为给定 ID 的 user 创建请求
      this.axios.get('http://127.0.0.1:9000/api/user/getUserlist')
        .then( (response) => {
          // console.log(response.data);
          this.list = response.data;
          this.listLoading = false;
        })
        .catch(function (error) {
          console.log(error);
        });


      // getUserList().then(response => {
      //   console.log(response)
      //   this.list = response.data
      //   this.listLoading = false
      // })
    }
  }
}
</script>

<style scoped>
  .pan-item.avatar{
    width: 100px!important;
    height: 100px!important;
    border-radius: 50%;
  }
</style>
