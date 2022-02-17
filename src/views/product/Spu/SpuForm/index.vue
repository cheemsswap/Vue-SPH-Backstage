<template>
  <el-dialog v-loading="loading" v-bind="$attrs" v-on="$listeners">
    <el-form :model="form">
      <el-form-item label="SPU名称" :label-width="formLabelWidth">
        <el-input
          v-model="form.spuName"
          placeholder="请输入SPU名称"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌" :label-width="formLabelWidth">
        <el-select v-model="form.tmId" placeholder="请选择品牌">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="trademark of form.trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" :label-width="formLabelWidth">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="2"
          placeholder="请输入SPU描述"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="SPU图片" :label-width="formLabelWidth">
        <el-upload
          :action="action"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :file-list="form.spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" :label-width="formLabelWidth">
        <el-select v-model="form.saleId" placeholder="请选择基本销售属性">
          <el-option
            :label="saleAttr.name"
            :value="saleAttr.id"
            v-for="saleAttr of form.saleAttrList"
            :key="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left: 5px"
          icon="el-icon-plus"
          type="primary"
          :disabled="form.saleId == '' ? true : false"
          @click="addAttr"
          >添加销售属性</el-button
        >
        <el-table border :data="form.spuSaleAttrList">
          <el-table-column prop="id" label="序号" width="60"> </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="80">
          </el-table-column>
          <el-table-column prop="spuSaleAttrValueList" label="属性名称列表">
            <template slot-scope="scope">
              <Tag v-bind.sync="scope.row" />
            </template>
          </el-table-column>
          <el-table-column prop="spuSaleAttrValueList" label="操作" width="100">
            <template slot-scope="scope">
              <el-popconfirm
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @onConfirm="delAttr(scope.row.id)"
              >
                <el-button type="danger" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="reset">重 置</el-button>
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="saveSpuForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  name: "SpuForm",
  data() {
    return {
      loading: false,
      form: {
        id: "",
        spuName: "",
        tmId: "",
        description: "",
        trademarkList: [],
        saleId: "",
        saleAttrList: [],
        spuSaleAttrList: [],
        spuImageList: [],
      },
      action: process.env.VUE_APP_BASE_API + "/admin/product/fileUpload",
      formLabelWidth: "120px",
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  props: [
    "id",
    "spuName",
    "description",
    "spuImageList",
    "tmId",
    "category3Id",
  ],
  watch: {
    id() {
      this.reset();
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.form.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.response.data;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file, fileList) {
      this.form.spuImageList = fileList;
    },
    delAttr(id) {
      this.form.saleId = "";
      this.form.spuSaleAttrList = this.form.spuSaleAttrList.filter((e) => {
        if (e.id == id) {
          this.form.saleAttrList.push({
            id,
            name: e.saleAttrName,
          });
          return false;
        }
        return true;
      });
    },
    addAttr() {
      let saleAttrName = "";
      this.form.saleAttrList = this.form.saleAttrList.filter((e) => {
        if (e.id == this.form.saleId) {
          saleAttrName = e.name;
          return false;
        }
        return true;
      });
      this.form.spuSaleAttrList.push({
        id: nanoid(),
        saleAttrName: saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.form.saleId = "";
    },
    reset() {
      this.loading = true;
      let flag = 0;
      this.form = {
        ...this.form,
        spuName: this.spuName,
        description: this.description,
        tmId: this.tmId,
        spuImageList: this.spuImageList,
        saleId: "",
        spuImageList: [],
        spuSaleAttrList: [],
        id: this.id,
      };
      //发请求
      //2个基本请求
      this.$store
        .dispatch("spu/reqgetTrademarkList")
        .then((data) => {
          this.form.trademarkList = data;
          flag++;
          if ((this.form.id && flag == 4) || (!this.form.id && flag == 2)) {
            this.loading = false;
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
          this.form.trademarkList = [];
          this.loading = false;
        });
      this.$store
        .dispatch("spu/reqgetbaseSaleAttrList")
        .then((data) => {
          flag++;
          if ((this.form.id && flag == 4) || (!this.form.id && flag == 2)) {
            this.loading = false;
          }
          this.form.saleAttrList = data;
          if (this.form.id) {
            this.$store
              .dispatch("spu/reqgetSpuById", { spuId: this.form.id })
              .then((data) => {
                flag++;
                if (
                  (this.form.id && flag == 4) ||
                  (!this.form.id && flag == 2)
                ) {
                  this.loading = false;
                }
                this.form.spuSaleAttrList = data.spuSaleAttrList;
                this.form.saleAttrList = this.form.saleAttrList.filter((e) => {
                  for (const spuSaleAttr of data.spuSaleAttrList) {
                    if (spuSaleAttr.saleAttrName == e.name) return false;
                  }
                  return true;
                });
              })
              .catch((error) => {
                this.$message({
                  type: "error",
                  message: error,
                });
                this.loading = false;
              });
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
          this.loading = false;
          this.form.saleAttrList = [];
        });

      if (this.form.id) {
        this.$store
          .dispatch("spu/reqgetspuImageList", { spuId: this.form.id })
          .then((data) => {
            flag++;
            if ((this.form.id && flag == 4) || (!this.form.id && flag == 2)) {
              this.loading = false;
            }
            for (const value of data) {
              if (value.imgUrl) {
                this.form.spuImageList.push({
                  response: { data: value.imgUrl },
                  url: value.imgUrl,
                });
              }
            }
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error,
            });
            this.loading = false;
          });
      }
    },
    clear() {
      //清空
      this.form = {
        ...this.form,
        spuName: "",
        description: "",
        tmId: "",
        spuImageList: [],
        saleId: "",
        spuImageList: [],
        spuSaleAttrList: [],
        id: "",
      };
      this.loading = true;
      let flag = 0;
      this.$store
        .dispatch("spu/reqgetTrademarkList")
        .then((data) => {
          this.form.trademarkList = data;
          flag++;
          if ((this.form.id && flag == 4) || (!this.form.id && flag == 2)) {
            this.loading = false;
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
          this.form.trademarkList = [];
          this.loading = false;
        });
      this.$store
        .dispatch("spu/reqgetbaseSaleAttrList")
        .then((data) => {
          flag++;
          if ((this.form.id && flag == 4) || (!this.form.id && flag == 2)) {
            this.loading = false;
          }
          this.form.saleAttrList = data;
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
          this.loading = false;
          this.form.saleAttrList = [];
        });
    },
    saveSpuForm() {
      //保存
      console.log("正在保存");
      this.clear();
    },
  },
};
</script>

<style>
</style>