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
      <el-table-column label="title">
        <template slot-scope="scope">
          <span v-if='scope.row.pid !== 0 '>
             |--{{ scope.row.title }}
          </span>
          <span v-else >
             {{ scope.row.title }}
          </span>
         
        </template>
      </el-table-column>
      <el-table-column label="path" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="o" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.o }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="operation" width="auto" align="center">
        <template slot-scope="scope">
          <span style="font-size:22px;">
            <i class="el-icon-edit" title="修改" @click="editCateShow(scope)"/>&nbsp;
            <i class="el-icon-circle-close" title="删除" @click="delCateShow(scope)"/>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="姓名：" @dragDialog="handleDrag">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="pid">
          <el-input v-model="form.pid" />
        </el-form-item>
        <el-form-item label="path">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item label="o">
          <el-input v-model="form.o" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="editCate()">Create</el-button>
          <el-button @click="dialogTableVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 增加按钮弹出层 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="addCate" label-position="left" label-width="80px" style="width: 500px; margin-left:50px;">
        <el-form-item label="title" prop="title">
          <el-input v-model="addCate.title" />
        </el-form-item>
        <el-form-item label="pid" >
          <el-select v-model="addCate.pid" class="filter-item" placeholder="Please select">
            <el-option label="顶级栏目" :value="0" />
            <el-option v-for="(item,index) in pid" :key="index" :label="item['title']" :value="item['id']" />
          </el-select>
        </el-form-item>
        <el-form-item label="path" >
          <el-input v-model="addCate.path" />
        </el-form-item>
        <el-form-item label="o" >
          <el-input v-model="addCate.o" />
        </el-form-item>
        
      </el-form>
       
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createCate():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

     <!-- 增加按钮弹出层 -->
    <el-dialog title="是否确认删除?" :visible.sync="dialogDelCateVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="delCate()">
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
      pid:[],
      addCate: {
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
      dialogDelCateVisible:false,
      delCateId:0,
      editCateId:0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    editCate(){
      console.log(this.form)
      this.axios.post('http://127.0.0.1:9000/api/cate/editCate',this.$qs.stringify(this.form))
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
    editCateShow(date){
      this.editCateId = date.row.id 
      this.axios.get('http://127.0.0.1:9000/api/cate/getCate/' + this.editCateId )
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
    delCateShow(date) {
      console.log(date)
      this.delCateId = date.row.id 
      this.dialogDelCateVisible = true
    },
    delCate(){
      this.axios.get('http://127.0.0.1:9000/api/cate/deleteCate/' + this.delCateId )
        .then( (response) => {
          // console.log(response.data);
          this.list = response.data;
          this.dialogDelCateVisible = false
           this.fetchData()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    createCate() {
     
      var params = this.addCate;
     
      this.axios.post('http://127.0.0.1:9000/api/cate/addCate',this.$qs.stringify(params))
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
      
       // 获取一级栏目
      this.axios.get('http://127.0.0.1:9000/api/cate/getCatePid')
        .then( (response) => {
          
          this.pid = response.data;
          console.log(this.pid);
        })
        .catch(function (error) {
          console.log(error);
        });

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
      this.axios.get('http://127.0.0.1:9000/api/cate/getCatelist')
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
