<template>
  <el-dialog v-bind="$attrs" v-on="$listeners">
    <el-form v-model="form">
      <el-form-item label="SPU名称" label-width="120px">
        <el-input disabled v-model="form.spuName" />
      </el-form-item>
      <el-form-item label="SKU名称" label-width="120px">
        <el-input v-model="form.skuName" />
      </el-form-item>
      <el-form-item label="价格(元)" label-width="120px">
        <el-input v-model.number="form.skuPrice" />
      </el-form-item>
      <el-form-item label="重量(千克)" label-width="120px">
        <el-input v-model.number="form.skuWeight" />
      </el-form-item>
      <el-form-item label="规则描述" label-width="120px">
        <el-input v-model="form.skuDescribe" type="textarea" rows="3" />
      </el-form-item>
      <el-form-item label="平台属性" label-width="120px">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            v-for="AttrInfo of form.AttrInfoList"
            :key="AttrInfo.id"
            :inline="true"
            :label="AttrInfo.attrName"
            label-width="80px"
          >
            <el-select placeholder="请选择" v-model="AttrInfo.isSelect">
              <el-option
                v-for="attrValue of AttrInfo.attrValueList"
                :label="attrValue.valueName"
                :value="attrValue.valueName"
                :key="attrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" label-width="120px">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            v-for="SaleAttr of form.SaleAttrList"
            :key="SaleAttr.id"
            :inline="true"
            :label="SaleAttr.saleAttrName"
            label-width="80px"
          >
            <el-select placeholder="请选择" v-model="SaleAttr.isSelect">
              <el-option
                :label="spuSaleAttrValue.saleAttrValueName"
                v-for="spuSaleAttrValue of SaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                :value="spuSaleAttrValue.saleAttrValueName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" label-width="120px">
        <el-table
          ref="multipleTable"
          border
          :data="form.ImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="imgUrl" label="图片">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.imgUrl"
                lazy
                style="width: 100px; height: 100px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column prop="" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.isDefault ? 'success' : ''"
                @click="setImgDefault(scope.row)"
                >设为默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  name: "SkuForm",
  data() {
    return {
      form: {
        ImageList: [],
        SaleAttrList: [],
        AttrInfoList: [],
        spuName: this.spuName,
        skuName: "",
        skuPrice: "",
        skuWeight: "",
        skuDescribe: "",
      },
      multipleSelection: [],
    };
  },
  watch: {
    spuName() {
      this.form.spuName = this.spuName;
    },
  },
  props: ["spuName"],
  methods: {
    handleSelectionChange(val) {
      this.form.ImageList.forEach((e) => {
        let flag = true;
        for (const v of val) {
          if (v.id == e.id) {
            e.isSelect = true;
            flag = false;
            break;
          }
        }
        if (flag) {
          e.isSelect = false;
          e.isDefault = false;
        }
      });
      this.multipleSelection = val;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    setImgDefault(row) {
      const { id } = row;
      this.form.ImageList.forEach((e) => {
        if (e.id == id) {
          e.isDefault = true;
          if (e.isSelect == false) {
            this.toggleSelection([row]);
          }
        } else e.isDefault = false;
      });
    },
    getnanoid() {
      return nanoid();
    },
    clear() {
      //清空数据
      this.form = {
        ImageList: [],
        SaleAttrList: [],
        AttrInfoList: [],
      };
    },
    async getData(id, category1Id, category2Id, category3Id) {
      this.form.ImageList = await this.getImageList(id);
      this.form.SaleAttrList = await this.getSaleAttrList(id);
      this.form.AttrInfoList = await this.getAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
    },
    //获取图片列表
    getImageList(spuId) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("spu/reqgetspuImageList", { spuId })
          .then((data) => {
            data.forEach((element) => {
              element.isSelect = "";
              element.isDefault = "";
            });
            resolve(data);
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error,
            });
            reject(error);
          });
      });
    },
    //获取属性列表
    getSaleAttrList(spuId) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("spu/reqspuSaleAttrList", { spuId })
          .then((data) => {
            data.forEach((element) => {
              element.isSelect = "";
            });
            resolve(data);
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error,
            });
            reject(error);
          });
      });
    },
    //获取平台属性数据
    getAttrInfoList(category1Id, category2Id, category3Id) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("spu/reqattrInfoList", {
            category1Id,
            category2Id,
            category3Id,
          })
          .then((data) => {
            data.forEach((element) => {
              element.isSelect = "";
            });
            resolve(data);
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error,
            });
            reject(error);
          });
      });
    },
  },
};
</script>

<style>
</style>