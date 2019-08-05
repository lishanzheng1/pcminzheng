<template>
  <section>
    <el-main style="padding-top: 5px">
      <el-col :span="24">
        <el-col :span="21" class="toolbar">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础服务</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form inline>


          <el-form-item label="省">
            <el-select v-model="queryData.province" placeholder="请选择" clearable
                       @change="changeCityForFid(queryData.province)" style="width: 150px">
              <el-option
                v-for="item in provinces"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地市">
            <el-select v-model="queryData.city" placeholder="请选择" clearable
                       @change="changeAreaForFid(queryData.city)" style="width: 150px">
              <el-option
                v-for="item in citys"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="县（市、区）">
            <el-select v-model="queryData.area" placeholder="请选择" clearable
                       @change="changeCountyForFid(queryData.area)" style="width: 150px">
              <el-option
                v-for="item in areas"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="乡镇（街道）">
            <el-select v-model="queryData.county" placeholder="请选择" clearable
                       @change="changeVillageForFid(queryData.county)" style="width: 150px">
              <el-option
                v-for="item in countys"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="村（居）民委员会">
            <el-select v-model="queryData.village" placeholder="请选择" clearable style="width: 150px">
              <el-option
                v-for="item in villages"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>

          <br/>
          <el-form-item label="账号名称">
            <el-input placeholder="账号名称" v-model="queryData.queryName" @keyup.enter.native="query" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="tableData" highlight-current-row v-loading="listLoading">
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (queryData.page - 1) * queryData.rows}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="loginName" label="账号" sortable align="center">
        </el-table-column>
        <el-table-column prop="role.name" label="角色" sortable align="center">
        </el-table-column>
        <el-table-column label="省" prop="province" sortable align="center">
        </el-table-column>
        <el-table-column label="地市" prop="city" sortable align="center">
        </el-table-column>
        <el-table-column label="县（市、区）" prop="area" sortable align="center">
        </el-table-column>
        <el-table-column label="乡镇（街道）" prop="county" sortable align="center">
        </el-table-column>
        <el-table-column label="村（居）民委员会" prop="village" sortable align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="220">
          <template slot-scope="scope">
            <el-button type="info" icon="el-icon-setting" title="重置密码"
                       @click="handleSetNewPassword(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" title="用户删除" @click="handleDel(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :span="24" class="toolbar" style="text-align: center">
        <Page :currentPage="queryData.page" :rows="queryData.rows" :total="total"
              @handleCurrentChangeSub="handleCurrentChange"/>
      </el-col>
    </el-main>

    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" :rules="rules" :model="formData" ref="formData">
        <el-input auto-complete="off" v-model="formData.id" style="display: none"></el-input>
        <el-form-item label="账号" prop="loginName">
          <el-input auto-complete="off" v-model="formData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="loginPwd">
          <el-input auto-complete="off" v-model="formData.loginPwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false;">取消</el-button>
        <el-button type="primary" @click="formSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量添加用户" :visible.sync="batchDialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" ref="formData">
        <el-form-item label="选择部门" style="margin-top: 25px;">
          <el-cascader
            v-model="batchFormData.dept"
            :options="deptDatas"
            :props="{ value: '_id', label: 'name'}"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="用户数量">
          <el-input auto-complete="off" v-model="batchFormData.userNum" placeholder="请填写0到10之间的数字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible = false;">取消</el-button>
        <el-button type="primary" @click="batchFormSubmit" :loading="batchSubmitLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>
    import {
        queryUserForPage,
        queryRoleForList,
        userInsert,
        userUpdate,
        userDelete,
        queryUserOne,
        queryDeptList,
        userBatchInsert,
        setPassword
    } from '../../api'

    import jsonUtil from '../../util/jsonUtil'
    import Page from '../../components/Page'

    export default {
        data() {
            return {
                title: '新增',   //弹出框标题
                dialogVisible: false,  //弹出框是否显示
                listLoading: false,  //数据加载等待是否显示
                submitLoading: false,
                batchDialogVisible: false,
                batchSubmitLoading: false,
                tableData: null,  //表格数据
                provinces: [],
                citys: [],
                areas: [],
                countys: [],
                villages: [],
                queryData: {
                    queryName: '',  //模糊查询内容
                    page: 1,   //表格当前页
                    rows: 10,   //表格每页记录数
                    type: 'admin',
                    province: '',
                    city: '',
                    area: '',
                    county: '',
                    village: '',
                },
                total: 0,  //表格总记录数
                roles: [], //角色
                deptDatas: [],
                formData: {  //表单数据
                    id: 0,
                    loginName: '',
                    loginPwd: ''
                },
                batchFormData: {
                    dept: [],
                    userNum: 5
                },
                rules: {  //数据校验规则
                    loginName: [
                        {required: true, message: '请输入用户账号', trigger: 'blur'}
                    ],
                    loginPwd: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'}
                    ]
                }
            };
        },
        components: {
            Page
        },
        methods: {
            handleCurrentChange(val) {
                this.queryData.page = val;
                this.loadTableData();
            },
            async loadTableData() {
                this.listLoading = true;
                try {
                    const result = await queryUserForPage(this.queryData, "GET");
                    if (result.code == "0") {
                        console.log(result);
                        this.tableData = result.data.list;
                        this.total = result.data.count;
                    } else {
                        this.$message.error('加载用户列表失败，请联系管理员');
                    }
                    this.listLoading = false;
                } catch (e) {
                    this.$message.error('系统异常，请联系管理员');
                    this.listLoading = false;
                }
            },
            async loadRoleData() {
                const result = await queryRoleForList();
                if (result.code == "0") {
                    this.roles = result.data;
                }
            },
            changeCityForFid(fid) {
                this.queryData.city = "";
                this.queryData.area = "";
                this.queryData.county = "";
                this.queryData.village = "";
                this.citys = this.deptList.filter(item => {
                    return item.fid == fid;
                });
            },
            changeAreaForFid(fid) {
                this.queryData.area = "";
                this.queryData.county = "";
                this.queryData.village = "";
                this.areas = this.deptList.filter(item => {
                    return item.fid == fid;
                });
            },
            changeCountyForFid(fid) {
                this.queryData.county = "";
                this.queryData.village = "";
                this.countys = this.deptList.filter(item => {
                    return item.fid == fid;
                });
            },
            changeVillageForFid(fid) {
                this.queryData.village = "";
                this.villages = this.deptList.filter(item => {
                    return item.fid == fid;
                });
            },
            async loadDeptData() {
                let result = await queryDeptList();

                if (result.code != '0') {
                    return;
                }

                if (result.data.length > 0) {
                    this.deptList = result.data;
                    this.provinces = this.deptList.filter(item => {
                        return item.fid == "0";
                    });
                    let map = {};
                    let resultArr = [];
                    result.data.forEach((item, index) => {
                        item.children = [];
                        map[item._id] = item;
                    });
                    result.data.forEach((item, index) => {
                        if (item.fid == '0') {
                            resultArr.push(item);
                        } else {
                            let parent = map[item.fid];
                            parent.children.push(item);

                        }
                    });
                    jsonUtil.deleteEmptyProperty(resultArr);
                    this.deptDatas = resultArr;
                }
            },
            query() {
                this.queryData.page = 1;
                this.loadTableData();
            },
            handleAdd() {
                this.title = "新增";
                this.dialogVisible = true;
                this.clearFormData();
            },
            handleBatchAdd() {
                this.batchFormData.dept.length = 0;
                this.batchFormData.userNum = 5;
                this.batchDialogVisible = true;
            },
            async handleUpt(row) {
                this.title = "编辑";

                try {
                    const result = await queryUserOne({id: row._id}, "GET");
                    if (result.code == "0") {
                        this.dialogVisible = true;
                        this.formData = {  //表单数据
                            id: result.data._id,
                            loginName: result.data.loginName,
                            loginPwd: result.data.loginPwd
                        };
                    } else {
                        this.$message.error('用户信息加载失败，请联系管理员');
                    }
                } catch (e) {
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            clearFormData() {
                this.formData = {
                    id: 0,
                    loginName: '',
                    loginPwd: ''
                }
            },
            async formSubmit() {
                let bool = false;

                this.$refs.formData.validate((valid) => {
                    bool = valid;
                });

                if (!bool) {
                    return;
                }

                this.submitLoading = true;
                if (this.formData.id == "0") {
                    try {
                        const result = await userInsert(this.formData, "POST");
                        if (result.code == "0") {
                            this.$message({message: '恭喜你，用户信息添加成功', type: 'success'});
                            this.dialogVisible = false;
                            this.clearFormData();
                            this.loadTableData();
                        } else if (result.code == "-1") {
                            this.$message.error(`[ ${this.formData.loginName} ] 账号已经存在，请重新输入`);
                        } else {
                            this.$message.error('用户信息添加失败，请联系管理员');
                        }
                        this.submitLoading = false;
                    } catch (e) {
                        this.$message.error('系统异常，请联系管理员');
                        this.submitLoading = false;
                    }
                } else {
                    try {
                        const result = await userUpdate(this.formData, "POST");
                        if (result.code == "0") {
                            this.$message({message: '恭喜你，用户信息修改成功', type: 'success'});
                            this.dialogVisible = false;
                            this.clearFormData();
                            this.loadTableData();
                        } else if (result.code == "-1") {
                            this.$message.error(`[ ${this.formData.loginName} ] 账号已经存在，请重新输入`);
                        } else {
                            this.$message.error('用户信息修改失败，请联系管理员');
                        }
                        this.submitLoading = false;
                    } catch (e) {
                        this.$message.error('系统异常，请联系管理员');
                        this.submitLoading = false;
                    }
                }
            },
            async batchFormSubmit() {
                if (this.batchFormData.dept.length == 0) {
                    this.$message.error('请选择部门！');
                    return false;
                }
                if (this.batchFormData.userNum == '') {
                    this.$message.error('请填写生成的用户数量！');
                    return false;
                }
                if (isNaN(this.batchFormData.userNum) || this.batchFormData.userNum <= 0 || this.batchFormData.userNum > 10) {
                    this.$message.error('请正确填写用户数量!');
                    return false;
                }

                try {
                    const result = await userBatchInsert({
                        userNum: this.batchFormData.userNum,
                        deptId: this.batchFormData.dept[this.batchFormData.dept.length - 1]
                    }, 'POST');

                    if (result.code == "0") {
                        this.$message({message: '恭喜你，用户批量添加成功', type: 'success'});
                        this.batchDialogVisible = false;
                        this.loadTableData();
                    } else {
                        this.$message.error('用户信息批量添加失败，请联系管理员');
                    }
                    this.batchSubmitLoading = false;
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            async handleSetNewPassword(row) {
                try {
                    const result = await setPassword(row.id);
                    if (result.code == "0") {
                        this.$message({message: '恭喜你，密码重置成功', type: 'success'});
                        this.loadTableData();
                    } else {
                        this.$message.error('密码重置失败，请联系管理员');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            handleDel(row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.deleteOne(row._id);
                }).catch(() => {
                });
            },
            async deleteOne(id) {
                try {
                    const result = await userDelete({id}, "GET");
                    if (result.code == "0") {
                        this.$message({message: '恭喜你，用户信息删除成功', type: 'success'});
                        this.queryData.page = 1;
                        this.loadTableData();
                    } else if (result.code == "-1") {
                        this.$message.error('不能删除自己的账号!');
                    } else {
                        this.$message.error('用户信息删除失败，请联系管理员');
                    }
                } catch (e) {
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            async loadJobDataByCode(orgCode) {
                const result = await queryJobsByOrgCode({code: orgCode}, "POST");
                if (result.status == "0") {
                    this.jobs = result.list;
                }
            }
        },
        mounted() {
            this.loadTableData();
            //this.loadRoleData();
            this.loadDeptData();
        }
    }
</script>

<style type="text/css">
  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 10px 0px;
  }

  .el-select {
    width: 100%;
  }

  .el-cascader {
    width: 100%;
  }
</style>
