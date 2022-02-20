<template>
  <div class="spu-container">
    <el-card class="box-card">
      <CategorySelect @getCategory="getCategory" />
    </el-card>
    <el-card class="box-card" v-loading="loading">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addSpuForm"
        :disabled="category3Id == '' || category3Id == undefined ? true : false"
        >添加SPU</el-button
      >
      <el-table :data="recordsData" border style="width: 100%">
        <el-table-column prop="id" label="序号" width="100"> </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="180">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <HintButtom
              type="success"
              icon="el-icon-plus"
              title="添加SKU"
              @click="addSkuForm(scope.row)"
            ></HintButtom>
            <HintButtom
              type="warning"
              icon="el-icon-edit"
              title="编辑"
              @click="updateSpuFrom(scope.row)"
            ></HintButtom>
            <HintButtom
              type="info"
              icon="el-icon-view"
              title="查看"
              @click="SeeSkuList(scope.row)"
            ></HintButtom>
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="你确定要删除吗？"
              @onConfirm="deleteSpuForm(scope.row)"
            >
              <HintButtom
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                title="删除"
              ></HintButtom>
            </el-popconfirm>
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
    <SpuForm
      v-bind="SpuForm"
      :title="SpuForm.title"
      :visible.sync="SpuForm.visible"
      @getrecordsData="getrecordsData"
      ref="spufrom"
    />
    <SkuForm
      v-bind="SkuForm"
      :title="SkuForm.title"
      :visible.sync="SkuForm.visible"
      ref="skufrom"
    />
    <el-dialog
      title="SKU列表"
      :visible.sync="centerDialogVisible"
      width="60%"
      center
    >
      <el-table :data="SkuList" border style="width: 100%">
        <el-table-column prop="id" label="id" width="80"> </el-table-column>
        <el-table-column prop="skuName" label="名称" width="180">
        </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column prop="weight" label="重量"> </el-table-column>
        <el-table-column prop="isSale" label="正在销售"> </el-table-column>
        <el-table-column prop="skuDefaultImg" label="图片">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.skuDefaultImg"
              lazy
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      SpuForm: {
        title: "",
        visible: false,
        id: "",
        spuName: "",
        tmId: "",
        description: "",
        category3Id: "",
      },
      SkuForm: {
        title: "",
        visible: false,
        spuName: "",
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
      centerDialogVisible: false,
      SkuList: [],
    };
  },
  components: {
    SpuForm,
    SkuForm,
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
        id: undefined,
        spuName: "",
        tmId: "",
        description: "",
        category3Id: this.category3Id,
      };
      this.$refs.spufrom.reset();
    },
    updateSpuFrom(row) {
      const { id, spuName, description, spuImageList, tmId, category3Id } = row;
      this.SpuForm = {
        ...this.SpuForm,
        title: "修改SPU",
        visible: true,
        id,
        spuName,
        description,
        tmId,
        spuImageList: spuImageList || [],
        category3Id,
      };
      this.$refs.spufrom.reset();
    },
    deleteSpuForm(row) {
      const { id } = row;
      this.$store
        .dispatch("spu/reqdeleteSpuInfo", { spuId: id })
        .then((data) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getrecordsData();
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
        });
    },
    addSkuForm(row) {
      // console.log(row);
      const { id, spuName } = row;
      this.SkuForm = {
        visible: true,
        title: "添加SKU",
        spuName,
        spuId: id,
      };
      this.$refs.skufrom.clear();
      this.$refs.skufrom.getData(
        id,
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
    },
    handleCurrentChange(val) {
      this.currentPageData.currentPage = val;
      this.getrecordsData();
    },
    SeeSkuList(row) {
      const { id } = row;
      this.$store
        .dispatch("spu/reqfindBySpuId", { spuId: id })
        .then((data) => {
          this.SkuList = data;
          this.centerDialogVisible = true;
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
        });
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