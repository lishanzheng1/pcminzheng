<template>
  <section>
    <el-main style="padding-top: 5px">
      <el-col :span="24">
        <el-col :span="21" class="toolbar">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础服务</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form inline>
          <el-form-item label="菜单名称">
            <el-input placeholder="菜单名称" v-model.trim="queryData.queryName" @keyup.enter.native="query" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="tableData.datas" highlight-current-row v-loading="tableData.listLoading">
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (queryData.page - 1) * queryData.rows}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜单名称" sortable>
        </el-table-column>
        <el-table-column prop="address" label="访问地址" sortable>
        </el-table-column>
      </el-table>

      <el-col :span="24" class="toolbar" style="text-align: center">
        <Page :currentPage="queryData.page" :rows="queryData.rows" :total="tableData.total" @handleCurrentChangeSub="handleCurrentChange"/>
      </el-col>
    </el-main>

    <el-dialog :title="dialogData.title" :visible.sync="dialogData.dialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" :rules="rules" :model="formData" ref="formData">
        <el-input auto-complete="off" v-model="formData.id" style="display: none"></el-input>
        <el-form-item label="菜单名称" prop="name">
          <el-input auto-complete="off" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="访问地址" prop="address" style="margin-top: 25px;">
          <el-input auto-complete="off" v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label="父级节点" prop="fid" style="margin-top: 25px;">
          <el-select v-model="formData.fid" placeholder="请选择">
            <el-option
              v-for="item in menus"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogData.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="formSubmit" :loading="dialogData.submitLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>
  import {
    queryMenuForPage,
    queryMenuForList,
    queryMenuOne,
    menuInsert,
    menuUpdate,
    menuDelete
  } from '../../api'

  import Page from '../../components/Page'

  export default {
    data () {
      return {
        dialogData: {
          title: '新增',   //弹出框标题
          dialogVisible: false,  //弹出框是否显示
          submitLoading: false,  //提交等待是否显示
        },
        queryData: {
          queryName: '',  //模糊查询内容
          page: 1,   //表格当前页
          rows: 9,   //表格每页记录数
        },
        tableData: {
          listLoading: false,  //数据加载等待是否显示
          datas: null,  //表格数据
          total: 0,  //表格总记录数
        },
        menus: [], //菜单
        formData : {  //表单数据
          id: 0,
          name: '',
          address: '',
          fid: ''
        },
        rules: {  //数据校验规则
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入菜单访问地址', trigger: 'blur' }
          ],
          fid: [
            { required: true, message: '请选择父级节点', trigger: 'blur' }
          ]
        }
      };
    },
    components: {
      Page
    },
    methods: {
      handleCurrentChange (val) {
        this.queryData.page = val;
        this.loadTableData();
      },
      async loadTableData () {
        this.listLoading = false;
        let param = {
          page: this.page,
          rows: this.rows,
          queryName: this.queryName
        };

        try{
          const result = await queryMenuForPage(this.queryData, "GET");
          if(result.code == "0"){
            this.tableData.datas = result.data.list;
            this.tableData.total = result.data.count;
          } else {
            this.$message.error('菜单列表查询失败，请联系管理员');
          }
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
        }
        this.listLoading = false;
      },
      async loadMenuData () {
        const result = await queryMenuForList();
        if(result.code == "0"){
          result.data.unshift({_id: '0', name: '根节点'});
          this.menus = result.data;
        }
      },
      query () {
        this.queryData.page = 1;
        this.loadTableData();
      },
      handleAdd () {
        this.loadMenuData ();
        this.dialogData.title = "新增";
        this.dialogData.dialogVisible = true;
        this.clearFormData();
      },
      async handleUpt (row) {
        this.loadMenuData ();
        this.dialogData.title = "编辑";
        this.dialogData.dialogVisible = true;

        try{
          const result = await queryMenuOne({id: row._id}, "GET");
          if(result.code == "0"){
            this.formData = {
              id: result.data._id,
              name: result.data.name,
              address: result.data.address,
              fid: result.data.fid
            };
          } else {
            this.$message.error('获取菜单信息失败');
          }
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
        }
      },
      clearFormData () {
        this.formData = {
          id: '',
          name: '',
          address: '',
          fid: ''
        }
      },
      async formSubmit () {
        let bool = false;
        this.$refs.formData.validate((valid) => {
          bool = valid;
        });

        if(!bool){
          return;
        }

        this.dialogData.submitLoading = true;
        if(this.formData.id == 0){
          try{
            const result = await menuInsert(this.formData, "POST");
            if(result.code == "0"){
              this.$message({message: '恭喜你，菜单信息添加成功', type: 'success'});
              this.dialogData.dialogVisible = false;
              this.clearFormData();
              this.loadTableData();
            } else {
              this.$message.error('菜单信息添加失败');
            }
          } catch (e) {
            this.$message.error('系统异常，请联系管理员');
          }
          this.dialogData.submitLoading = false;
        } else {
          try{
            const result = await menuUpdate(this.formData, "POST");
            if(result.code == "0"){
              this.$message({message: '恭喜你，菜单信息修改成功', type: 'success'});
              this.dialogData.dialogVisible = false;
              this.clearFormData();
              this.loadTableData();
            } else {
              this.$message.error('菜单信息修改失败');
            }
          } catch (e) {
            this.$message.error('系统异常，请联系管理员');
          }
          this.dialogData.submitLoading = false;
        }
      },
      handleDel (row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.deleteOne(row._id);
        }).catch(() => {});
      },
      async deleteOne(id){
        try {
          const result = await menuDelete({id}, "GET");
          if(result.code == "0"){
            this.$message({message: '恭喜你，菜单信息删除成功', type: 'success'});
            this.loadTableData();
          } else {
            this.$message.error('菜单信息删除失败');
          }
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
        }
      }
    },
    mounted () {
      this.loadTableData();
    }
  }
</script>

<style type="text/css">
  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 10px 0;
  }
</style>
