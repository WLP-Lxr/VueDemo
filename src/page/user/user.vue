<template>
 <div id="app">
    <el-row>
        <el-col :span="16">
            <el-button type="primary" @click="handleAdd">添加</el-button>
        </el-col>

        <el-col :span="3" size="small">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
        </el-col>

        <el-col :span="2">
            <el-button type="primary" @click="handleSearch">查找</el-button>
        </el-col>



    </el-row>

    <el-table
            :data="crud"
            stripe
            style="width: 100%"
            height="500">
        <el-table-column
                fixed
                prop="id"
                label="编号"
                width="50"
                color="#409EFF">
        </el-table-column>
        <el-table-column
                prop="crudName"
                label="名称"
                width="100">
        </el-table-column>
        <el-table-column
                prop="crudAge"
                label="年龄"
                width="100">
        </el-table-column>
        <el-table-column
                prop="crudSalary"
                label="薪水"
                width="100">
        </el-table-column>
        <el-table-column
                prop="crudHobby"
                label="爱好"
                width="240">
        </el-table-column>
        <el-table-column
                prop="crudAddr"
                label="地址"
                width="120">
        </el-table-column>
        <!--    编辑 删除按钮    -->
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row,crud)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row,crud)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageCode"
                :page-sizes="pageOption"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalaElemnts">
        </el-pagination>
    </div>


    <!--添加与编辑、弹出层页面-->
    <div  v-show="show">

        <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="昵称" :label-width="formLabelWidth">
                    <el-input v-model="formCrud.crudName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" :label-width="formLabelWidth">
                    <el-input v-model="formCrud.crudAge" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="薪水" :label-width="formLabelWidth">
                    <el-input v-model="formCrud.crudSalary"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  label="爱好" :label-width="formLabelWidth">
                    <el-input v-model="formCrud.crudHobby"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  label="地址" :label-width="formLabelWidth">
                    <el-input v-model="formCrud.crudAddr" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" >取 消</el-button>
                <el-button v-show="btn_show" type="primary" @click="handleUpdate">确 定</el-button>
                <el-button type="primary" v-show="btn2_show" @click="add">确定添加</el-button>
            </div>
        </el-dialog>
    </div>


</div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      show: false,
        btn_show: false,
        btn2_show: false,
        crud: [],
        pageCode: 0, //默认页
        pageSize: 10,//每页10条
        totalPage: 10 ,//总页数
        pageOption: [10, 50, 100],
        totalaElemnts: 100, //总记录数
        dialogFormVisible: false,
        input: '',
        formCrud: {
            id: '',
            crudName: '',
            crudAge: '',
            crudHobby: '',
            crudSalary: '',
            crudAddr: '',
        },
          formLabelWidth: '120px'
    }
  },
  created: function() {
    this.findByPage(this.pageCode, this.pageSize)
  },
  methods: {
    findByPage(pageCode, pageSize) {
      axios.post("apis/page",{
          start: pageCode,
          length: pageSize
      }).then( (res) => {
          if (res.status === 200)
          this.totalPage = res.data.totalPages //总页数
          this.totalaElemnts = res.data.totalElements //总记录数
          this.crud = res.data.content
          console.log(this.crud)

      }).catch((err) => {
          console.log(err)
      })

      },

      handleSizeChange(val) {
        this.findByPage(this.pageCode, val)
      },

        handleCurrentChange(val) {
        this.findByPage(val, this.pageSize)
      },

       /**
        查找
       /*
      handleSearch(input){
        axios.post("http://localhost:8080/search/" + input,{
        }）.then((res) => {
            if(res.status === 200)
            this.findByPage(this.pageCode, this.pageSize)
        }).catch((err) => {
           console.log(err)
       })
      },
        /**
         * 删除
          * @param index
         * @param row
         * @param crud
         */
     handleDelete(index, row, crud) {
       var id = crud[index].id;
       axios.delete("apis/crud/" + id, {
       }).then((res) =>{
           this.findByPage(this.pageCode, this.pageSize)
       }).catch((err) => {
           console.log(err)
       })
     },
        /**
         * 编辑 之前会显数据
         * @param index
         * @param row
         * @param crud
         */
    handleEdit(index, row, crud) {

      this.show = true
      this.dialogFormVisible = true
      this.btn_show = true
      this.btn2_show = false
      this.formCrud.id = crud[index].id
      this.formCrud.crudName = crud[index].crudName
      this.formCrud.crudAge = crud[index].crudAge
      this.formCrud.crudSalary = crud[index].crudSalary
      this.formCrud.crudHobby = crud[index].crudHobby
      this.formCrud.crudAddr = crud[index].crudAddr
    },

     /**
      * 编辑发送ajax请求
      */
    handleUpdate() {
      axios.put("/apis/updateUser",{
      id: this.formCrud.id,
      crudName: this.formCrud.crudName,
      crudAge:  this.formCrud.crudAge,
      crudHobby: this.formCrud.crudHobby,
      crudSalary: this.formCrud.crudSalary,
      crudAddr: this.formCrud.crudAddr
      }).then((res) => {
      //编辑成功后刷新页面
      this.findByPage(this.pageCode, this.pageSize)
      //关闭遮罩层
      this.show = false
      this.dialogFormVisible = false
      console.log(1, res)
      }).catch((err) => {
      console.log(2, err)
      })
    },
     /**
      * 点击添加按钮的时候显示遮罩层,同时将编辑的按钮隐藏掉
      */
    handleAdd() {
      this.show= true
      this.dialogFormVisible = true
      //将双向绑定数据滞空
      this.formCrud.crudName= ''
      this.formCrud.crudAge = ''
      this.formCrud.crudHobby = ''
      this.formCrud.crudSalary = ''
      this.formCrud.crudAddr = ''
      //将新编辑按钮隐藏掉
      this.btn_show = false
      //将新增按钮显示 v-show 其实是display：none 和black操作
      this.btn2_show  =true
    },
    /**
      *  新增
      */
    add() {
      axios.post("/apis/addCrud",{
        crudName: this.formCrud.crudName,
        crudAge:  this.formCrud.crudAge ,
        crudHobby: this.formCrud.crudHobby,
        crudSalary: this.formCrud.crudSalary,
        crudAddr: this.formCrud.crudAddr
      }).then((res) => {
         //添加成功后刷新页面
        this.findByPage(this.pageCode, this.pageSize)
        //同时关闭遮罩层
        this.show= true
        this.dialogFormVisible = false

      }).catch((err) => {
          console.log(err)
      })
    },
  
  }
}
</script>

<style scoped>
</style>
