<template>
  <section>
    <el-main style="padding-top: 5px">
      <el-col :span="24">
        <el-col :span="21" class="toolbar">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>采集数据</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-col>
      <div class="search_style">
        <el-form :inline="true" class="demo-form-inline">

          <el-form-item label="省" >
            <el-select v-model="formData.province" placeholder="请选择" clearable
                       @change="changeCityForFid(formData.province)" style="width: 150px">
              <el-option
                v-for="item in provinces"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地市">
            <el-select v-model="formData.city" placeholder="请选择" clearable
                       @change="changeAreaForFid(formData.city)" style="width: 150px">
              <el-option
                v-for="item in citys"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="县（市、区）">
            <el-select v-model="formData.area" placeholder="请选择" clearable
                       @change="changeCountyForFid(formData.area)" style="width: 150px">
              <el-option
                v-for="item in areas"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="乡镇（街道）">
            <el-select v-model="formData.county" placeholder="请选择" clearable
                       @change="changeVillageForFid(formData.county)" style="width: 150px">
              <el-option
                v-for="item in countys"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="村（居）民委员会">
            <el-select v-model="formData.village" placeholder="请选择" clearable style="width: 150px">
              <el-option
                v-for="item in villages"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="采集员账号">
            <el-input placeholder="请输入" v-model.trim="formData.cjname" clearable style="width: 150px"></el-input>
          </el-form-item>

          <el-form-item label="采集状态">
            <el-select v-model="formData.status" placeholder="请选择" clearable style="width: 100px">
              <el-option
                v-for="item in statusList"
                :key="item.key"
                :label="item.label"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="老人姓名">
            <el-input placeholder="请输入" v-model.trim="formData.name" clearable style="width: 130px"></el-input>
          </el-form-item>
          <el-form-item label="老人常用联系电话">
            <el-input placeholder="请输入" v-model.trim="formData.phone" clearable style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="老年人年龄">
            <el-select v-model="formData.age" placeholder="请选择" clearable style="width: 120px">
              <el-option
                v-for="item in ages"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="老年人类别">
            <el-select v-model="formData.oldType" multiple placeholder="请选择" style="width: 305px">
              <el-option
                v-for="item in oldTypes"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关爱服务需求">
            <el-select v-model="formData.demand " multiple placeholder="请选择" style="width: 210px">
              <el-option
                v-for="item in demands"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" @click="search">搜索</el-button>
            <el-button type="primary" size="small"  @click="exportList">导出excel</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData.datas" highlight-current-row v-loading="tableData.listLoading"
                height="640"  class="mytable"   >
        <el-table-column fixed label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (queryData.page - 1) * queryData.rows}}</span>
          </template>
        </el-table-column>


        <el-table-column label="老人姓名" prop="olds[0].name" sortable width="150" fixed align="center">
        </el-table-column>
        <el-table-column label="老年人类别" prop="olds[0].oldType" width="250" fixed align="center">
        </el-table-column>
        <el-table-column label="老人数量" prop="olds.length"  align="center" width="50" >
        </el-table-column>
        <el-table-column label="老人性别" prop="olds[0].sex"  width="60" align="center">
        </el-table-column>

        <el-table-column label="身份证号" prop="olds[0].idNumber" width="200" align="center">
        </el-table-column>
        <el-table-column label="年龄" prop="olds[0].age" width="100" align="center">
        </el-table-column>
        <el-table-column label="民族" prop="olds[0].nation" width="100" align="center">
        </el-table-column>
        <el-table-column label="文化程度" prop="olds[0].education" width="100" align="center">
        </el-table-column>
        <el-table-column label="是否登记户口" prop="olds[0].isRegister" width="130" align="center">
        </el-table-column>
        <el-table-column label="户籍所在地" prop="olds[0].nativePlace" width="100" align="center">
        </el-table-column>
        <el-table-column label="省" prop="province" sortable width="100" align="center">
        </el-table-column>
        <el-table-column label="地市" prop="city" sortable width="100" align="center">
        </el-table-column>
        <el-table-column label="县（市、区）" prop="area" sortable width="150" align="center">
        </el-table-column>
        <el-table-column label="乡镇（街道）" prop="county" sortable width="150" align="center">
        </el-table-column>
        <el-table-column label="村（居）民委员会" prop="village" sortable width="160" align="center">
        </el-table-column>
        <!--        <el-table-column label="居住地址" prop="olds[0].address" width="100">-->
        <!--        </el-table-column>-->
        <el-table-column label="婚姻及配偶情况" prop="olds[0].partnerState" width="150" align="center">
        </el-table-column>
        <el-table-column label="配偶姓名" prop="olds[0].partnerName" width="150" align="center">
        </el-table-column>
        <el-table-column label="配偶身份证号" prop="olds[0].partnerIdNumber" width="200" align="center">
        </el-table-column>
        <!--        <el-table-column label="是否为失独家庭" prop="olds[0].isLoss" width="130">-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="健康状况" prop="olds[0].isLoss" width="100">-->
        <!--        </el-table-column>-->

        <!--        <el-table-column label="患病类型" prop="olds[0].illType" width="100">-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="残疾类别及等级" prop="olds[0].disabilityLevel" width="130">-->
        <!--        </el-table-column>-->
        <el-table-column label="生活状况" prop="olds[0].livingCondition" width="100" align="center">
        </el-table-column>
        <el-table-column label="家庭经济来源" prop="olds[0].sourceOfIncome" width="250" align="center">
        </el-table-column>
        <el-table-column label="平均年收入（元）" prop="olds[0].income" width="150" align="center">
        </el-table-column>
        <el-table-column label="家庭救助帮扶情况" prop="olds[0].rescueState" width="250" align="center">
        </el-table-column>
        <el-table-column label="老人常用联系电话" prop="olds[0].phone" sortable width="160" align="center">
        </el-table-column>

        <el-table-column label="陪伴居住情况" prop="olds[0].accompany" width="130" align="center">
        </el-table-column>
        <el-table-column label="日常生活照料人" prop="olds[0].lookAfter" width="250" align="center">
        </el-table-column>
        <el-table-column label="关爱服务需求" prop="olds[0].demand" width="250" align="center">
        </el-table-column>



        <!--        <el-table-column label="居住地址" prop="pro" sortable width="200">-->



        <el-table-column label="子女姓名" prop="childrens[0].name" width="130" align="center">
        </el-table-column>
        <el-table-column label="子女数量" prop="childrens.length" width="50" align="center">
        </el-table-column>
        <el-table-column label="子女性别" prop="childrens[0].sex" width="60" align="center">
        </el-table-column>
        <el-table-column label="子女身份证号" prop="childrens[0].idNumber" width="200" align="center">
        </el-table-column>
        <el-table-column label="子女常用联系电话" prop="childrens[0].phone" width="150" align="center">
        </el-table-column>
        <el-table-column label="子女外出原因" prop="childrens[0].outgoingCause" width="250" align="center">
        </el-table-column>
        <el-table-column label="子女外出地点" prop="childrens[0].outgoingplace" width="250" align="center">
        </el-table-column>
        <el-table-column label="子女外出时间" prop="childrens[0].outgoingTime" width="150" align="center">
        </el-table-column>
        <el-table-column label="子女回家探望情况" prop="childrens[0].visit" width="250" align="center">
        </el-table-column>
        <el-table-column label="子女计划返回时间" prop="childrens[0].planGoHomeTime" width="150" align="center">
        </el-table-column>
        <el-table-column label="子女是否有配偶" prop="childrens[0].isHasPartner" width="150" align="center">
        </el-table-column>
        <el-table-column label="子女配偶姓名" prop="childrens[0].name2" width="130" align="center">
        </el-table-column>
        <el-table-column label="子女配偶身份证号" prop="childrens[0].idNumber2" width="200" align="center">
        </el-table-column>
        <el-table-column label="子女配偶常用联系电话" prop="childrens[0].phone2" width="160" align="center">
        </el-table-column>
        <el-table-column label="子女配偶外出原因" prop="childrens[0].outgoingCause2" width="250" align="center">
        </el-table-column>
        <el-table-column label="子女配偶外出地点" prop="childrens[0].outgoingplace2" width="250" align="center">
        </el-table-column>
        <el-table-column label="子女配偶外出时间" prop="childrens[0].outgoingTime2" width="150" align="center">
        </el-table-column>
        <el-table-column label="子女配偶回家探望情况" prop="childrens[0].visit2" width="250" align="center">
        </el-table-column>
        <el-table-column label="子女配偶计划返回时间" prop="childrens[0].planGoHomeTime2" width="160" align="center">
        </el-table-column>

        <el-table-column label="采集时间" prop="time" :formatter="timeFormatter" sortable width="200" align="center">
        </el-table-column>
        <el-table-column prop="userInfo[0].loginName" label="采集员" sortable width="100" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已完成</span>
            <span v-else>未完成</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" title="查看详情" @click="gotoInfo(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--<el-col :span="24" class="toolbar">-->
      <!--<el-button type="primary" @click="exportList">导出excel</el-button>-->
      <!--<el-pagination-->
      <!--layout="prev, pager, next"-->
      <!--:page-size="queryData.rows"-->
      <!--:total="tableData.total"-->
      <!--@current-change="handleCurrentChange"-->
      <!--style="float:right;">-->
      <!--</el-pagination>-->
      <!--</el-col>-->

      <el-col :span="24" class="toolbar"
              style="position: fixed;bottom: -20px;padding: 10px 0;margin-left: 0;margin-right: 0;">
        <span style="position: absolute;left: 20px;top:15px;font-size: 14px;">共{{tableData.total}}条</span>
        <Page :currentPage="queryData.page" :rows="queryData.rows" :total="tableData.total"
              @handleCurrentChangeSub="handleCurrentChange"/>
      </el-col>

    </el-main>

  </section>

</template>

<script>
    import {
        queryInfoForPage,
        queryInfoDetail,
        queryDeptList,
        exportList,
        infoSelect
    } from '../../api'

    import dateFormat from '../../util/dateFormat'
    import jsonUtil from '../../util/jsonUtil'
    import storageUtil from '../../util/storageUtil'
    import Page from '../../components/Page'
    import moment from 'moment'
    import Vue from 'vue'

    export default {
        data() {
            return {
                headStyle:{
                    textAlign:'center'
                },
                dialogData: {
                    title: '新增',   //弹出框标题
                    dialogVisible: false,  //弹出框是否显示
                    submitLoading: false,  //提交等待是否显示
                },
                queryData: {
                    queryName: '',  //模糊查询内容
                    page: 1,   //表格当前页
                    rows: 10,   //表格每页记录数
                },
                tableData: {
                    listLoading: false,  //数据加载等待是否显示
                    deptArr: [],  //表格数据
                    total: 0,  //表格总记录数,
                    datas: []
                },
                tabData: {
                    tab1: true,
                    tab2: false,
                    tab3: false,
                    tab4: false,
                    tab5: false,
                    tab6: false,
                    tab7: false
                },
                deptDatas: [],
                formData: {
                    name: '',
                    phone: '',
                    cjname: '',

                    oldType: [],
                    age: '',
                    demand: [],

                    province: '',
                    city: '',
                    area: '',
                    county: '',
                    village: '',
                    status: '',
                },
                oldTypes: [],
                ages: [],
                demands: [],
                //TODO
                deptList: [],
                provinces: [],
                citys: [],
                areas: [],
                countys: [],
                villages: [],
                statusList: [{label:"未完成",key:"0"},{label:"已完成",key:"1"}],
            };
        },
        components: {
            Page
        },
        methods: {
            timeFormatter(row, column) {
                return moment(new Date(row.time)).format('YYYY-MM-DD HH:mm:ss')
            },
            deptFormatter(row, column) {
                if (row.userInfo[0] == undefined || !row.userInfo[0].hasOwnProperty('dept')) {
                    return '';
                }
                this.tableData.deptArr.forEach((item, index) => {
                    if (row.userInfo[0].dept == item._id) {
                        return item.name;
                    }
                });
            },
            async gotoInfo(row) {
                try {
                    const result = await queryInfoDetail({id: row._id}, 'GET');
                    if (result.code == '0') {
                        window.open(result.url, '_blank');
                    }
                } catch (e) {
                    alert(e.message);
                    this.$message.error('系统异常，请联系管理员');
                }
            },
            handleCurrentChange(val) {
                this.queryData.page = val;
                this.loadTableData();
            },
            async loadTableData() {
                this.listLoading = false;
                try {
                    this.queryData.name = this.formData.name;
                    this.queryData.phone = this.formData.phone;
                    this.queryData.cjname = this.formData.cjname;
                    this.queryData.oldType = this.formData.oldType;
                    this.queryData.age = this.formData.age;
                    this.queryData.demand = this.formData.demand;
                    this.queryData.province = this.formData.province;
                    this.queryData.city = this.formData.city;
                    this.queryData.area = this.formData.area;
                    this.queryData.county = this.formData.county;
                    this.queryData.village = this.formData.village;
                    this.queryData.status = this.formData.status;

                    const result = await queryInfoForPage(this.queryData, "GET");
                    if (result.code == "0") {
                        this.tableData.datas = result.data.list;
                        this.tableData.datas.forEach(item => {

                            item.olds.forEach(oldsitem=>{
                                let datalist = oldsitem.data;
                                oldsitem.name = undefined;
                                datalist.forEach(item => {
                                    if (!oldsitem[item.key] ) {
                                        Vue.set(oldsitem, item.key, item.value);
                                    }else{
                                        oldsitem[item.key] =  oldsitem[item.key] + ","+item.value;
                                    }
                                });
                            });
                            item.childrens.forEach(childrensitem=>{
                                let datalist = childrensitem.data;
                                childrensitem.name = undefined;
                                datalist.forEach(item => {
                                    if (!childrensitem[item.key] ) {
                                        Vue.set(childrensitem, item.key, item.value);
                                    }else{
                                        childrensitem[item.key] =  childrensitem[item.key] + ","+item.value;
                                    }
                                });
                            });


                        });
                        console.log("当前数据", this.tableData.datas)

                        this.tableData.deptArr = result.deptList;
                        this.tableData.total = result.data.count;
                    } else {
                        this.$message.error('采集数据查询失败，请联系管理员');
                    }
                } catch (e) {
                    this.$message.error('系统异常，请联系管理员');
                }
                this.listLoading = false;
            },
            // handleClick(tab, event) {
            //   const index = parseInt(tab.index) + 1;
            //   for(let i = 1; i <= 7; i++ ){
            //     this.tabData['tab' + i] = false;
            //   }
            //   this.tabData['tab' + index] = true;
            // },
            changeCityForFid(fid) {
                this.formData.city = "";
                this.formData.area = "";
                this.formData.county = "";
                this.formData.village = "";
                this.citys = this.deptList.filter(item => {
                    return item.fid == fid;
                });
            },
            changeAreaForFid(fid) {
                this.formData.area = "";
                this.formData.county = "";
                this.formData.village = "";
                this.areas = this.deptList.filter(item => {
                    return item.fid == fid;
                });
            },
            changeCountyForFid(fid) {
                this.formData.county = "";
                this.formData.village = "";
                this.countys = this.deptList.filter(item => {
                    return item.fid == fid;
                });
            },
            changeVillageForFid(fid) {
                this.formData.village = "";
                this.villages = this.deptList.filter(item => {
                    return item.fid == fid;
                });
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
                    //先 过滤出省级
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
                            if (parent != undefined) {
                                parent.children.push(item);
                            }
                        }
                    });
                    jsonUtil.deleteEmptyProperty(resultArr);
                    this.deptDatas = resultArr;
                }
            },
            async loadSelectData() {
                let result = await infoSelect({type: "oldType"});
                if (result.code == 0) {
                    this.oldTypes = result.list;
                } else {

                }
                let result2 = await infoSelect({type: "age"});
                if (result2.code == 0) {
                    this.ages = result2.list;
                } else {

                }

                let result3 = await infoSelect({type: "demand"});
                if (result3.code == 0) {
                    this.demands = result3.list;
                } else {

                }
            },
            search() {
                this.queryData.page = 1;
                this.loadTableData();
            },
            async exportList() {
                window.location = `${this.serverUrl}/info/exportList?sessionId=${storageUtil.read("sessionId")}&name=${this.formData.name}&phone=${this.formData.phone}&cjname=${this.formData.cjname}&oldType=${this.formData.oldType}&age=${this.formData.age}&demand=${this.formData.demand}&province=${this.formData.province}&city=${this.formData.city}&area=${this.formData.area}&county=${this.formData.county}&village=${this.formData.village}`;
            }
        },
        mounted() {
            this.loadTableData();
            this.loadDeptData();
            this.loadSelectData();
        },

    }
</script>

<style type="text/css" scoped>
  .toolbar {
    background: #f2f2f2;
    margin: 20px 0;
    position: relative;
    text-align: center;
  }

  .info_card >>> .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #f00;
  }
  .mytable {
    margin-bottom: 30px;
  }

  .mytable >>> th {
    padding: 3px 0;
  }
  .mytable >>> td {
    padding: 1px 0;
  }

  .mytable >>> .cell {
    line-height: 16px;
  }

</style>
