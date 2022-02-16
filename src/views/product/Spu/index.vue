<template>
  <div class="spu-container">
    <el-card class="box-card">
      <CategorySelect @getCategory="getCategory" />
    </el-card>
    <el-card class="box-card" v-loading="loading">
      <el-button type="primary" icon="el-icon-plus" @click="addSpuForm"
        >添加SPU</el-button
      >
      <el-table :data="recordsData" border style="width: 100%">
        <el-table-column prop="id" label="序号" width="100"> </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="180">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <HintButtom
              type="success"
              icon="el-icon-plus"
              title="添加SKU"
            ></HintButtom>
            <HintButtom
              type="warning"
              icon="el-icon-edit"
              title="编辑"
            ></HintButtom>
            <HintButtom
              type="info"
              icon="el-icon-view"
              title="查看"
            ></HintButtom>
            <HintButtom
              type="danger"
              icon="el-icon-delete"
              title="删除"
            ></HintButtom>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPageData.currentPage"
        :page-size="currentPageData.pageSize"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="currentPageData.total"
      >
      </el-pagination>
    </el-card>
    <SpuForm :title="SpuForm.title" :visible.sync="SpuForm.visible" />
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  data() {
    return {
      SpuForm: {
        title: "",
        visible: false,
      },
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //分页数据
      currentPageData: {
        //当前页
        currentPage: 1,
        //每页展示的数量
        pageSize: 3,
        //总条数
        total: 0,
      },
      recordsData: [],
      loading: false,
    };
  },
  components: {
    SpuForm,
  },
  methods: {
    getCategory(category1Id, category2Id, category3Id) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      if (category3Id != "") {
        this.getrecordsData();
      } else {
        this.clearrecordsData();
      }
    },
    getrecordsData() {
      this.loading = true;
      const req = {
        category3Id: this.category3Id,
      };
      this.$store
        .dispatch("spu/reqgetspuInfoList", {
          page: this.currentPageData.currentPage,
          limit: this.currentPageData.pageSize,
          req,
        })
        .then((response) => {
          this.loading = false;
          this.currentPageData.total = response.total;
          this.recordsData = response.records;
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: error,
          });
        });
    },
    clearrecordsData() {
      this.recordsData = [];
      this.currentPageData.currentPage = 1;
      this.currentPageData.total = 0;
    },
    addSpuForm() {
      this.SpuForm = {
        ...this.SpuForm,
        title: "新增SPU",
        visible: true,
      };
    },
    handleCurrentChange(val) {
      this.currentPageData.currentPage = val;
      this.getrecordsData();
    },
  },
};
</script>

<style  lang="scss" scoped>
.spu {
  &-container {
    margin: 30px;
    .el-card {
      margin-bottom: 20px;
      .el-table {
        margin-top: 20px;
      }
      .el-pagination {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}
</style>