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
      <el-table-column label="cate">
        <template slot-scope="scope">
            {{ scope.row.cate }}
        </template>
      </el-table-column>
      <el-table-column label="title">
        <template slot-scope="scope">
            {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="content" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="o" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.o }}</span>
        </template>
      </el-table-column>
      <el-table-column label="status" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
     
      
      <el-table-column label="operation" width="auto" align="center">
        <template slot-scope="scope">
          <span style="font-size:22px;">
            <i class="el-icon-edit" title="修改" @click="editArticleShow(scope)"/>&nbsp;
            <i class="el-icon-circle-close" title="删除" @click="delArticleShow(scope)"/>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="修改文章" @dragDialog="handleDrag">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="cate_id">
          <el-select v-model="form.cate_id" class="filter-item" placeholder="Please select">
            <el-option v-for="(item,index) in pid" :key="index" :label="item['title']" :value="item['id']" />
          </el-select>
        </el-form-item>
       
        <el-form-item label="status">
          <el-select v-model="form.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in status" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="o">
          <el-input v-model="form.o" />
        </el-form-item>
        <el-form-item label="content">
         <tinymce v-model="form.content"  :height="300" style="display:block"/>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="editArticle()">Create</el-button>
          <el-button @click="dialogTableVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 增加按钮弹出层 -->
    <el-dialog title="添加文章" :visible.sync="dialogFormVisible" style="width:100%;">
      <el-form ref="dataForm" :rules="rules" :model="addArticle" label-position="left" label-width="80px" style="width: 700px; margin-left:50px;">
        <el-form-item label="title" prop="title">
          <el-input v-model="addArticle.title" />
        </el-form-item>
        <el-form-item label="cate_id" >
          <el-select v-model="addArticle.cate_id" class="filter-item" placeholder="Please select">
            <el-option v-for="(item,index) in pid" :key="index" :label="item['title'] + item['id']" :value="item['id']" />
          </el-select>
        </el-form-item>
        <el-form-item label="status" >
          <el-select v-model="addArticle.status" class="filter-item" placeholder="Please select">
            <el-option v-for="(item,index) in status" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="o" >
          <el-input v-model="addArticle.o" />
        </el-form-item>
        <el-form-item label="content" >
          
            <tinymce v-model="addArticle.content"  :height="300" style="display:block"/>
          
        </el-form-item>

        
      </el-form>
       
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createArticle():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

     <!-- 删除按钮弹出层 -->
    <el-dialog title="是否确认删除?" :visible.sync="dialogDelArticleVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="delArticle()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Tinymce from '@/components/Tinymce'

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
  components: { ImageCropper, PanThumb, Tinymce },
  data() {
    return {
      content:``,
      pid:[],
      grender: ['男','女'],
      status:[0,1],
      addArticle: {
        title: '',
        cate_id: '',
        o: '',
        content: '',
        status: '',
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
        title: '',
        cate_id: '',
        content: '',
        o: '',
        status: '',
      },
      dialogTableVisible: false,
      list: null,
      listLoading: true,
      dialogDelArticleVisible:false,
      delArticleId:0,
      editArticleId:0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    editArticle(){
      console.log(this.form)
      this.axios.post('http://127.0.0.1:9000/api/article/editArticle',this.$qs.stringify(this.form))
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
    editArticleShow(date){
      this.editArticleId = date.row.id 
       // 获取一级栏目
      this.axios.get('http://127.0.0.1:9000/api/article/getCatePid')
        .then( (response) => {
          
          this.pid = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.axios.get('http://127.0.0.1:9000/api/article/getArticle/' + this.editArticleId )
        .then( (response) => {
          this.form = response.data[0]
          this.dialogTableVisible = true
           this.fetchData()
        })
        .catch(function (error) {
          console.log(error);
        });

       
    },
    delArticleShow(date) {
      console.log(date)
      this.delArticleId = date.row.id 
      this.dialogDelArticleVisible = true
    },
    delArticle(){
      this.axios.get('http://127.0.0.1:9000/api/article/deleteArticle/' + this.delArticleId )
        .then( (response) => {
          // console.log(response.data);
          this.list = response.data;
          this.dialogDelArticleVisible = false
           this.fetchData()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    createArticle() {
     
      var params = this.addArticle;
     
      this.axios.post('http://127.0.0.1:9000/api/article/addArticle',this.$qs.stringify(params))
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
      this.axios.get('http://127.0.0.1:9000/api/article/getCatePid')
        .then( (response) => {
          
          this.pid = response.data;
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
      this.axios.get('http://127.0.0.1:9000/api/article/getArticlelist')
        .then( (response) => {
          console.log(response.data);
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

  .el-dialog__body {
    width: 1200px!important;
  }

  .mce-flow-layout-item.mce-last,.mce-container, .mce-container-body {
    width: 300px!important;
  }

  #mceu_43 {
    width: 300px;
  }
</style>
