<template>
  <div class="tradeark-container">
    <!---顶部添加按钮--->
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark"
      >添加</el-button
    >
    <!---中间展示表格--->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        max-width="400"
        align="center"
      >
      </el-table-column>
      <el-table-column label="品牌LOGO" max-width="400" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 50px"
            :src="scope.row.logoUrl ? scope.row.logoUrl : '/static/default.jpg'"
            lazy
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark()"
          >
            {{ innerWidth > 660 ? "修改" : "" }}
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">
            {{ innerWidth > 660 ? "删除" : "" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!---底部分页器--->
    <el-pagination
      v-loading="loading"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="currentPageData.currentPage"
      :page-sizes="[3, 5, 10, 20]"
      :page-size="currentPageData.pageSize"
      layout="total, prev, pager, next,->,jumper,sizes "
      :total="currentPageData.total"
    >
    </el-pagination>

    <el-dialog :title="form.title" :visible.sync="form.dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="序号" :label-width="form.formLabelWidth">
          <el-input
            v-model="form.id"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" :label-width="form.formLabelWidth">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Logo" :label-width="form.formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="form.action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearTradeMark">取 消</el-button>
        <el-button type="primary" @click="saveTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //用于判断是否展示 修改和删除按钮上的文字
      innerWidth: this.getInnerWidth(),
      //表格数据
      tableData: [],
      //分页数据
      currentPageData: {
        //当前页
        currentPage: parseInt(this.$route.query.page) || 1,
        //每页展示的数量
        pageSize: parseInt(this.$route.query.size) || 3,
        //总条数
        total: 0,
      },
      loading: true,
      form: {
        dialogFormVisible: false,
        formLabelWidth: "100px",
        title: "",
        id: "",
        tmName: "",
        action: process.env.VUE_APP_BASE_API + "/admin/product/fileUpload",
        imageUrl: "",
      },
    };
  },
  mounted() {
    window.onresize = () => {
      if (!this.timer) {
        // 使用节流机制，降低函数被触发的频率
        this.timer = true;
        let that = this; // 匿名函数的执行环境具有全局性，为防止this丢失这里用that变量保存一下
        setTimeout(function () {
          that.innerWidth = that.getInnerWidth();
          that.timer = false;
        }, 20);
      }
    };
    this.getData();
  },
  destroyed() {
    // 组件销毁后解绑事件
    window.onresize = null;
  },
  methods: {
    getInnerWidth() {
      return window.innerWidth;
    },
    handleCurrentChange(val) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: val,
        },
      });
      this.currentPageData.currentPage = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.$router.push({
        query: {
          page: 1,
          size: val,
        },
      });
      this.currentPageData.currentPage = 1;
      this.currentPageData.pageSize = val;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch("trademark/getProductBaseTrademarkList", {
          page: this.currentPageData.currentPage,
          limit: this.currentPageData.pageSize,
        })
        .then(() => {
          const { records, total } = this.$store.getters.currentpagedata;
          this.tableData = records;
          this.currentPageData.total = total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    addTradeMark() {
      this.form.title = "新增品牌";
      this.form.dialogFormVisible = true;
    },
    updateTradeMark() {
      this.form.title = "修改品牌";
      this.form.dialogFormVisible = true;
    },
    saveTradeMark() {
      this.$store
        .dispatch("trademark/addBaseTrademark", {
          tmName: this.form.tmName,
          logoUrl: this.form.imageUrl || "",
        })
        .then((data) => {
          this.clearTradeMark();
          this.getData();
        })
        .catch((error) => {
          console.log("失败");
        });
    },
    clearTradeMark() {
      this.form.tmName = undefined;
      this.form.imageUrl = undefined;
      this.form.dialogFormVisible = false;
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) this.form.imageUrl = res.data;
      else this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style  lang="scss" scoped>
.tradeark {
  &-container {
    margin: 30px;
    .el-table {
      margin-top: 20px;
    }
    .el-pagination {
      margin-top: 20px;
      position: relative;
      text-align: center;
    }
    .el-dialog {
      .el-form {
        .el-form-item {
          .avatar-uploader {
            border: 1px dashed #d9d9d9;
            width: 178px;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:hover {
              border-color: #409eff;
            }
            .avatar {
              width: 178px;
              height: 178px;
              display: block;
            }
            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 178px;
              height: 178px;
              line-height: 178px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>