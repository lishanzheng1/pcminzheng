<template>
  <div>
    <el-button :disabled="firstDisabled" @click="toFirstPage" size="mini">首页</el-button>
    <el-pagination
      layout="prev, pager, next"
      :page-size="rows"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      style="display: inline-block;padding-right: 0px;">
    </el-pagination>
    <el-button :disabled="isLastDisabled" @click="toLastPage" size="mini">尾页</el-button>
    <el-pagination
      layout="jumper"
      :page-size="rows"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      style="display: inline-block;padding-left: 0px;">
    </el-pagination>
  </div>

</template>

<script>
    export default {
      data () {
        return {
          totalPage: Math.ceil(this.total / this.rows),
          firstDisabled: true
        }
      },
      props: {
        currentPage: {
          type: Number,
          default: 1
        },
        rows: {
          type: Number,
          default: 10
        },
        total: {
          type: Number,
          default: 0
        }
      },
      methods: {
        handleCurrentChange (page) {
          this.firstDisabled = page == 1 ? true : false;
          this.$emit("handleCurrentChangeSub", page);
        },
        toFirstPage () {
          this.handleCurrentChange(1);
        },
        toLastPage () {
          this.currentPage = this.totalPage;
          this.handleCurrentChange(this.totalPage);
        }
      },
      watch: {
        total(val) {
          this.total = val;
          this.totalPage = Math.ceil(val / this.rows);
        }
      },
      computed : {
        isLastDisabled () {
          if(this.totalPage <= 0){
            return true;
          }
          return this.currentPage == this.totalPage ? true : false;
        }
      }
    }
</script>

<style type="text/css">

</style>
