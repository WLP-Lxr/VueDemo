<template>
  <div >
    <br>
    <h2>OVERVIEW</h2>
    <el-container>
        <el-aside>
          <br>
          <el-select v-model="dataBaseSelect" placeholder="请选择" @change="showTables">
        <el-option
          v-for="item in dataBases"
          :key="item.dataBaseName"
          :label="item.dataBaseName"
          :value="item.dataBaseName">
        </el-option>
      </el-select>
      
      <br><br><br>
        <el-select v-model="tableSelect" placeholder="请选择" @change="showFields">
        <el-option
          v-for="item in tables"
          :key="item.tableName"
          :label="item.tableName"
          :value="item.tableName">
        </el-option>
        </el-select>
        <el-divider></el-divider>
        <el-table
          :data="handledFields"
          fit
          style="width: 100%"
          height="400">

          <el-table-column
            prop="fieldName"
            label="fieldName"
            width="150">
          </el-table-column>

          <el-table-column
            prop="fieldType"
            label="fieldType"
            width="150">
          </el-table-column>
        </el-table>
       
        <el-divider></el-divider>
      </el-aside>

      <el-main>
        <el-row>
          <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="sql">
          </el-input>
        </el-row>
       <el-row>
         <el-button type="success" size="mini" icon="el-icon-search" @click="handleQuery">Simple Query</el-button>
         <el-button  type="primary" size="mini" icon="el-icon-check" @click="handleSave">Save Query</el-button>
         <el-button type="warning" size="mini" icon="el-icon-download" @click="export2Excel">Download Queried Data</el-button>
       </el-row>
        <br>
        <el-dialog title="查询结果" :visible.sync="dialogFormVisible" width="80%"> 
            <el-table
            :data="queryresult"
            border:header-cell-style="{background-color: lightblue,color:'#fff'}"
            :cell-style="tableCellStyle"
            :header-cell-style="tableHeaderCellStyle"
            fit
            style="width: 100%"
            height="400"
            >
            <el-table-column
              v-for="{ prop, label } in tableHeader"
              :key="prop"
              :prop="prop"
              :label="label"
              width="200"
            >
            </el-table-column>
          </el-table>
        </el-dialog>
        
        <!-- <p>{{tableHeader}}</p> 
        <span >{{queryresult}}</span> -->
      </el-main>
    </el-container>
     
  </div>
</template>


<script>
import axios from "axios";
   export default {
    data() {
      return {
        sql: "select * from default.f_adobe_datafeed_fixed_new_usa_custom_pageview_count limit 10",
        queryresult: "待查询",
        tableHeader: [],

        dataBases: [],
        dataBaseSelect: 'default',
        tables: [],
        tableSelect: 'f_adobe_datafeed_fixed_new_usa_custom_pageview_count',
        fields: [],
        handledFields: [],
        dialogFormVisible: false,
        value: ''
      }
    },

    created: function() {
      this.showDataBases();
      this.showTables();
      this.showFields();
      this.handleField();
    },

    methods: {

      /**
       * 表格颜色
       */
      tableCellStyle() {
        return 'border-color: #868686';
      },

    tableHeaderCellStyle() {
      return 'border-color: #868686; color: #606266;'
    },

      /**
       * 点击query按钮的时候，查询SQL同时弹出Dialog显示查询结果
       */
      handleQuery(){
        axios.get ("/apis/hive/searchByNormalSql/" + "?sql=" + this.sql ).then( res => {
        if(res.status == 200){
          this.queryresult = res.data.rows;
          this.handleDynamicTable();
          this.dialogFormVisible = true
        }
        }).catch(err => {
            console.log(err)
        })
      },
      handleSave(){
        axios.get("/apis/hive/saveQuery/" + "?content=" + this.sql ).then( res => {
        if(res.status == 200){
          this.$message("save OK!");
        }
        }).catch(err => {
            console.log(err)
        })
      },

      handleInput(){
        this.sql = this.textsql;
      },

      /**
       * 动态获取表头
       */
      handleDynamicTable() {
        if(this.queryresult == ""){
          console.log("未查到数据");
        }

        let dynamicHeader = [];
        for(let i = 0; i < (Object.keys(this.queryresult[0])).length; i++) {
          let property = (Object.keys(this.queryresult[0]))[i];
          dynamicHeader.push({"prop" : property, "label" : property});
        }
        this.tableHeader = dynamicHeader;
      },
      /**
       * 在created里面就初始化
       */
      showDataBases() {
        axios.get ("/apis/hive/dataBases" ).then( res => {
        if(res.status == 200){
          this.dataBases = res.data.rows
        }
        }).catch(err => {
            console.log(err)
        })
      }, 

      /**
       * 显示表选择器的表，首先要检查dataBaseName有没有被赋值
       */
      showTables(value) {
        if(this.dataBaseSelect == ''){
          console.log("未选择数据库");
          
        }
        value = this.dataBaseSelect
        axios.get ("/apis/hive/tables" + "?dataBaseName=" + value ).then( res => {
        if(res.status == 200){
          this.tables = res.data.rows;
        }
        }).catch(err => {
            console.log(err)
        })
      },

      /**
       * 当database和table都有值后，请求查看table的field
       */
      showFields() {
        axios.get ("/apis/hive/fields" + 
        "?dataBaseName=" + this.dataBaseSelect +
        "&tableName="+this.tableSelect)
        .then( res => {
        if(res.status == 200){
          this.fields = res.data.rows;
          this.handleField();
        }
        }).catch(err => {
            console.log(err)
        })
      },

      /**
       * 从返回的json里再加工，得到字段和属性
       */
      handleField(){
        var fieldList = [];
        for(var i = 0; i < this.fields.length; i++) {
          var fieldName = this.fields[i]["fieldName"];
          var fieldType = this.fields[i]["type"]
          fieldList.push({"fieldName" : fieldName, "fieldType" : fieldType});
        }
        this.handledFields = fieldList;
      },

      getHeader(data){
        let header = [];
        for(let i = 0; i < (Object.keys(data[0])).length; i++) {
          let property = (Object.keys(data[0]))[i];
          header.push(property);
        }
        return header;
      },

      formatJson(filterVal, jsonData) {
    　　　　return jsonData.map(v => filterVal.map(j => v[j]))
    　　},

      export2Excel() {
    　　　　require.ensure([], () => {
    　　　　　　const { export_json_to_excel } = require('../../vendor/Export2Excel');
    　　　　　　const tHeader = this.getHeader(this.queryresult);
    　　　　　　const filterVal = this.getHeader(this.queryresult);
    　　　　　　const list = this.queryresult;
    　　　　　　const data = this.formatJson(filterVal, list);
    　　　　　　export_json_to_excel(tHeader, data, '查询结果');
    　　　　})
    　 }
      ,
    }
  }
</script>

<style scoped>
  .customWidth{
    width: 100%;
  }
</style>
