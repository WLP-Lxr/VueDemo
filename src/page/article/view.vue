<template>
    <div>
        <h1>Overview</h1>
        <el-table
            border="true"
            :data="hiveData"
            style="width: 100%">
           
            <el-table-column
            label="dataBaseName"
            width="180">
            <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                <p><i class="el-icon-star-on"></i> Hive status: {{ status }}</p>
                <p><i class="el-icon-edit"></i> Description: {{ scope.row.Description }}</p>
                <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" >{{ scope.row.dataBaseName }}</el-tag>
                </div>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column label="action">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="success"
                @click="handleEdit(scope.$index, scope.row)">edit</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleJump(scope.$index, scope.row)">manage</el-button>
            </template>
            </el-table-column>
         </el-table>
        <el-dialog title="查询结果" :visible.sync="dialogFormVisible" width="80%">
            <el-table
            fit
            height="300"
            :data="tables"
            style="width: 100%">
            <el-table-column
                prop="dataBaseName"
                label="dataBaseName"
                width="180">
            </el-table-column>
            <el-table-column
                prop="tableName"
                label="tableName"
                width="180">
            </el-table-column>
            <el-table-column
                prop="description"
                label="description">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="updateTime">
            </el-table-column>
            <el-table-column
                prop="status"
                label="status">
            </el-table-column>
            </el-table>
        </el-dialog>
        <p>{{dataBaseName}}</p>

    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
      return {
            dialogFormVisible: false,
            hiveData: [],
            status: '',
            dataBaseName: '',
            tables: []
        } 
    },

    created: function() {
        this.showDataBases()
    },
    methods: {
        showDataBases(){
            axios.get("/apis/hive/dataBases", {
            }).then( res => {
                if(res.status == 200){
                    this.hiveData = res.data.rows
                    this.status = res.data.header.status
                    if(this.status == "200")
                        this.status = 'OK';
                    if(this.status == "500")
                        this.status = 'ERROR';
                    console.log(this.userData)
                }
            }).catch(err => {
                console.log(err)
            })
        },

        getTables(){
            axios.get ("/apis/hive/tables" + "?dataBaseName=" + this.dataBaseName ).then( res => {
            if(res.status == 200){
                this.tables = res.data.rows;
            }
            }).catch(err => {
                console.log(err)
            })
        },
        /**
         * 点击manage时的动作, 通过slot-scop的row获取的值
         */
        handleJump(index, row){
            // this.$router.push({
            //     name:'/#/view/tables',
            //     params: {dataBase: dataBaseName}
            // })
            this.dialogFormVisible = true;
            this.dataBaseName = row.dataBaseName;
            this.getTables();
        }
    }

};
</script>

<style scoped>

</style>