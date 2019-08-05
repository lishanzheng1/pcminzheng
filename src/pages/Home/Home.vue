<template>
  <el-container :style="{height: clientHeight}" >
    <el-header >
      <TopHeader/>
    </el-header>
    <el-container style="overflow: hidden">
      <el-col :span="3">
        <el-aside style="width:auto;height: 93vh;font-size:50px;">
          <el-menu style="height:100%">
            <el-tree class="hov" empty-text="" :data="tree_data" @node-click="handleNodeClick"></el-tree>
          </el-menu>
        </el-aside>
      </el-col>
      <el-col :span="21" style="background: #F0F2F5">
        <el-scrollbar style="height:100%;">
          <router-view>

          </router-view>
        </el-scrollbar>
      </el-col>
    </el-container>
  </el-container>
</template>

<script>
  import TopHeader from '../../components/Top-Header'
  import PubSub from 'PubSub-js'
  import storageUtil from '../../util/storageUtil'

  import {
    loadLoginerRoleMenus
  } from '../../api'

  import {
    userLogout
  } from '../../api'

  export default {
    data() {
      return {
        clientHeight: "0px",
        tree_data: []
      }
    },
    mounted () {
      this.clientHeight = `${document.documentElement.clientHeight}` + "px";
      window.onresize = temp => {
        this.clientHeight = `${document.documentElement.clientHeight}` + "px";
      };

      PubSub.subscribe("logout", () => {
        this.logout();
      });

      this.loadMenuTree();
    },
    components: {
      TopHeader
    },
    methods: {
      handleNodeClick (data) {
        if(data.children == undefined || data.children.length == 0){
          this.$router.replace(data.address);
        }
      },
      async logout () {
        try{
          let result = await userLogout();
          if(result.code == '0'){
            storageUtil.save('sessionId', null);
            this.$router.replace("/");
          } else {
            this.$message.error('退出失败，请联系管理员');
          }
        } catch (e) {
          alert(e.message);
          this.$message.error('系统异常，请联系管理员');
        }
      },
      async loadMenuTree() {
        try{
          const result = await loadLoginerRoleMenus();

          if(result.code == '0'){
            let dbMenuArr = result.data.dbMenuArr;
            let roleMenu = result.data.roleMenu;
            let roleMenuIdArr = roleMenu.map((item, index) => {
              return item.id;
            });
            let ownMenuList = new Array();
            dbMenuArr.forEach((item, index) => {
              if(roleMenuIdArr.indexOf(item._id) != -1){
                ownMenuList.push(item);
              }
            });

            ownMenuList = JSON.parse(JSON.stringify(ownMenuList).replace(/name/g, "label"));
            let map = {};
            let resultArr = [];
            ownMenuList.forEach((item, index) => {
              item.children = [];
              map[item._id] = item;
            });
            ownMenuList.forEach((item, index) => {
              if (item.fid == '0') {
                resultArr.push(item);
              } else {
                let parent = map[item.fid];
                parent.children.push(item);
              }
            });

            this.tree_data = resultArr;
          } else {
            this.$message.error('加载菜单失败，请联系管理员');
          }
        } catch (e) {
          alert(e.message);
          this.$message.error('系统异常，请联系管理员');
        }
      }
    }
  };
</script>

<style type="text/css">
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  *{
    padding: 0;
    margin: 0;
  }
  .el-menu{
    background:none;
    border-right:none;
  }
  .el-form--inline {
    margin-bottom: -10px;
  }
</style>
