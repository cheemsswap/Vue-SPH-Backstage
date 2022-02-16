<template>
  <el-dialog v-bind="$attrs" v-on="$listeners">
    <el-form :model="form">
      <el-form-item label="SPU名称" :label-width="formLabelWidth">
        <el-input
          v-model="form.name"
          placeholder="请输入SPU名称"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="请选择品牌">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" :label-width="formLabelWidth">
        <el-input type="textarea" :rows="2" placeholder="请输入SPU描述">
        </el-input>
      </el-form-item>
      <el-form-item label="SPU图片" :label-width="formLabelWidth">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" :label-width="formLabelWidth">
        <el-select>
          <el-option> </el-option>
          <el-option> </el-option>
          <el-option> </el-option>
        </el-select>
        <el-button style="margin-left: 5px" icon="el-icon-plus" type="primary"
          >添加销售属性</el-button
        >
        <el-table>
          <el-table-column prop="address" label="序号"> </el-table-column>
          <el-table-column prop="address" label="属性名"> </el-table-column>
          <el-table-column prop="address" label="属性名称列表">
          </el-table-column>
          <el-table-column prop="address" label="操作"> </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">清 空</el-button>
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="$emit('update:visible', false)"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style>
</style>