<template>
  <div>
    <el-col :span="24" class="header" style="background-color: #3a8ee6">
      <el-col :span="3" class="left_logo">
        <img src="../assets/logo_main.png"/>
      </el-col>
      <el-col :span="16" style="background-color: #3a8ee6">&nbsp;</el-col>
      <el-col :span="3" class="userinfo" style="background-color: #3a8ee6;" align="center">
        <el-dropdown trigger="hover" @command="handleCommand">
          <span class="el-dropdown-link userinfo-inner" style="color: #f0f0f0">欢迎您：{{userLoginName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="myInfo" divided>个人信息</el-dropdown-item>
            <el-dropdown-item command="myLogout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="2" style="background-color: #3a8ee6; font-size: 14px;" :title="userLoginDept">
        {{userLoginDept.length > 8 ? userLoginDept.substring(0, 8) + "..." : userLoginDept}}
      </el-col>
      <el-col :span="3" class="userinfo" style="background-color: #3a8ee6">
      </el-col>
    </el-col>

    <el-dialog
      title="修改用户"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form label-width="80px" :rules="rules" :model="formData" ref="formData">
        <el-input auto-complete="off" v-model="formData.id" style="display: none"></el-input>
        <el-form-item label="用户名" prop="userName">
          <el-input auto-complete="off" v-model="formData.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机"prop="phone">
          <el-input auto-complete="off" v-model="formData.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="formSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PubSub from 'PubSub-js'
  import {
    userInfo,update,queryUserOne
  } from '../api'

  export default {
    data() {
      return {
        userLoginName: null,
        userLoginDept: '',
        dialogVisible: false,
        submitLoading: false,  //提交等待是否显示
        userId:'',
        formData : {
          loginName:'',
          loginPwd :'',
          userName :'',
          phone:''
        },
        rules: {
          userName: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
              message: '手机号格式不对',
              trigger: 'blur'
            }
          ]
        },
      };
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case "myLogout" :
            this.$confirm('确认要退出系统吗?', '退出系统', {
              type: 'warning'
            }).then(() => {
              PubSub.publish("logout");
            }).catch();
            break;
          case "myInfo":
            this.dialogVisible = true;
            this.queryUserOne1();
            break;
          default :
            break;
        }
      },
      async queryUserOne1 () {
        this.title = '修改';
        this.state = true;
        this.dialogVisible = true;
        try {
          console.log(this.userId,"112");
          const result = await queryUserOne({id: this.userId}, "GET");
          if(result.code == "0"){
            console.log(result.data,"113");
            console.log(result.data.userName,"114");
            console.log(result.data.phone,"115");
            this.formData = {
              userName: result.data.userName,
              phone: result.data.phone
            };
          } else {
            this.$message.error('获取字典项信息失败，请联系管理员111');
          }
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
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
        this.submitLoading = true;
        try{
          const result = await update(
            {
              id: this.userId,
              userName:this.formData.userName,
              phone:this.formData.phone,
            }, "POST");
          if(result.code == "0"){
            this.$message({message: '恭喜你，个人信息修改成功', type: 'success'});
            this.dialogVisible = false;
          } else {
            this.$message.error('个人信息修改成功，请联系管理员');
          }
        } catch (e) {
          this.$message.error('系统异常，请联系管理员');
        }
        this.submitLoading = false;

      },
    },
    async mounted() {
      const result = await userInfo();
      if (result.code == '0') {
        this.userLoginName = result.data.loginName;
        this.userId = result.data.id;
        //this.userLoginDept = result.data.dept;
      }
    }
  }
</script>

<style type="text/css">
  * {
    text-decoration: none;
  }

  .icon_style .item {
    line-height: 0;
    margin-top: -6px;
  }

  .icon_style {
    color: #409EFF;
    text-decoration: none;
    float: right;
    font-size: 24px;
  }

  .header {
    height: 60px;
    line-height: 60px;
    color: #fff;
  }

  .userinfo-inner {
    cursor: pointer;
    color: #0000ff;
  }

  .userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 10px 10px 10px 16px;
    float: left;
  }

  .left_logo {
    background: #4794e2;
  }

  .left_logo > img {
    width: 70%;
    margin: 10px;
  }
</style>
