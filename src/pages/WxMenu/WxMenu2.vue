<template>
  <section>
    <el-main style="padding-top: 5px">
      <el-col :span="24">
        <el-col :span="21" class="toolbar">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home/wxMenu">菜单管理</el-breadcrumb-item>
            <el-breadcrumb-item >{{firstMenuName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-col>
      <el-table :data="sub_button" highlight-current-row v-loading="listLoading">
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="url" label="访问地址"></el-table-column>
        <el-table-column prop="type" label="菜单类型"></el-table-column>
        <el-table-column fixed="right" label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="info" icon="el-icon-edit" title="修改" @click="handleUpt(scope.$index)"></el-button>
            <el-button type="danger" icon="el-icon-delete" title="删除" @click="handleDel(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-col>
    </el-main>

    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" :rules="rules" :model="formData" ref="formData">
        <el-input auto-complete="off" v-model="formData.id" style="display: none"></el-input>
        <el-form-item label="菜单名称" prop="name">
          <el-input type="text" auto-complete="off" v-model="formData.name" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="访问地址" prop="url">
          <el-input type="text" auto-complete="off" v-model="formData.url" @keyup.native="rep"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select placeholder="请选择" v-model="formData.type">
            <el-option value="click" label="click"></el-option>
            <el-option value="view" label="view"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="formSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

  </section>

</template>

<script>
  import {
    queryWxMenuList,
    queryWxMenuOne,
    wxMenuAdd,
    wxMenuUpdate,
    wxMenuDelete
  } from '../../api'

  export default {
    data () {
      return {
        title: '',   //弹出框标题
        dialogVisible: false,  //弹出框是否显示
        submitLoading: false,  //提交等待是否显示
        listLoading: false,  //数据加载等待是否显示
        tableData: null,  //表格数据
        parentInfo: null,
        total: 0,
        formData : {
          name: '',
          url: '',
          type: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入二级菜单名称', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请输入二级菜单访问地址', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择二级菜单类型', trigger: 'blur' }
          ]
        },
        firstMenuId: '',
        firstMenuName: '',
        sub_button: [],
        flag: false,
        index: 0
      };
    },
    methods: {
      rep () {
        this.formData.url = this.formData.url.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFE30-\uFFA0]/g, '')
      },
      async loadTableData () {
        this.listLoading = true;
        try {
          const result = await queryWxMenuList({}, "GET");
          if(result.code == "0"){
            this.tableData = result.data;
          } else {
            this.$message.error('微信菜单加载失败，请联系管理员');
          }
          this.listLoading = false;
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
          this.listLoading = false;
        }
      },
      handleAdd () {
        if(this.sub_button.length >= 5){
          this.$message.error('公众号微信二级菜单不能超过5个!');
          return false;
        }
        this.title = '创建二级菜单';
        this.dialogVisible = true;
        this.flag = false;
        this.clearFormData();
      },
      async handleUpt (index) {
        this.title = '编辑二级菜单';
        this.dialogVisible = true;
        this.flag = true;

        try{
          this.index = index;
          this.formData.name = this.sub_button[index].name;
          this.formData.url = this.sub_button[index].url;
          this.formData.type = this.sub_button[index].type;
        } catch (e) {
          this.$message.error('加载二级菜单信息失败，请联系管理员');
        }
      },
      clearFormData () {
        this.formData = {
          name: '',
          url: '',
          type: ''
        };
      },
      async formSubmit () {
        let bool = false;

        this.$refs.formData.validate((valid) => {
          bool = valid;
        });

        if(!bool){
          return;
        }
        this.submitLoading = true;
        if(!this.flag){
          try{
            this.sub_button.push(this.formData);

            const result = await wxMenuUpdate({
              id: this.firstMenuId,
              sub_button: this.sub_button
            }, "POST");
            if(result.code == "0"){
              this.$message({message: '恭喜你，二级菜单信息添加成功', type: 'success'});
              this.dialogVisible = false;
              this.clearFormData();
              this.loadFirstMenuOne();
            } else {
              this.$message.error('二级菜单信息添加失败，请联系管理员');
            }
          } catch (e) {
            this.$message.error('系统异常，请联系管理员');
          }
          this.submitLoading = false;
        } else {
          try{
            this.sub_button[this.index] = this.formData;
            const result = await wxMenuUpdate({
              id: this.firstMenuId,
              sub_button: this.sub_button
            }, "POST");
            if(result.code == "0"){
              this.$message({message: '恭喜你，二级菜单信息修改成功', type: 'success'});
              this.dialogVisible = false;
              this.clearFormData();
              this.loadFirstMenuOne();
            } else {
              this.$message.error('二级菜单信息修改失败，请联系管理员');
            }
          } catch (e) {
            this.$message.error('系统异常，请联系管理员');
          }
          this.submitLoading = false;
        }
      },
      handleDel (index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.deleteOne(index);
        }).catch(() => { });
      },
      async deleteOne (index) {
        try{
          this.sub_button.splice(index, 1);
          const result = await wxMenuUpdate({
            id: this.firstMenuId,
            sub_button: this.sub_button.length == 0 ? 0 : this.sub_button
          }, "POST");
          if(result.code == "0"){
            this.$message({message: '恭喜你，二级菜单信息删除成功', type: 'success'});
            this.dialogVisible = false;
            this.clearFormData();
            this.loadFirstMenuOne();
          } else {
            this.$message.error('二级菜单信息删除失败，请联系管理员');
          }
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
        }
      },
      async loadFirstMenuOne() {
        try{
          const result = await queryWxMenuOne({id: this.firstMenuId});
          if(result.code == '0'){
            this.firstMenuName = result.data.name;
            this.sub_button = result.data.sub_button;
          }
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
        }
      }
    },
    mounted () {
      this.firstMenuId = this.$route.params.id;
      this.loadFirstMenuOne();
    }
  }
</script>

<style type="text/css">
  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 20px 0;
  }
</style>
