<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select v-model="formInline.category1" placeholder="请选择">
        <el-option
          v-for="category1 of formInline.category1List"
          :key="category1.id"
          :label="category1.name"
          :value="category1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="formInline.category2" placeholder="请选择">
        <el-option
          v-for="category2 of formInline.category2List"
          :key="category2.id"
          :label="category2.name"
          :value="category2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="formInline.category3" placeholder="请选择">
        <el-option
          v-for="category3 of formInline.category3List"
          :key="category3.id"
          :label="category3.name"
          :value="category3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      formInline: {
        category1: "",
        category2: "",
        category3: "",
        category1List: [],
        category2List: [],
        category3List: [],
      },
    };
  },
  watch: {
    "formInline.category1"() {
      this.getcategory2();
      this.clearcategory2();
    },
    "formInline.category2"(val) {
      if (val != "") this.getcategory3();
      this.clearcategory3();
    },
    "formInline.category3"(val) {
      this.$emit(
        "getCategory",
        this.formInline.category1,
        this.formInline.category2,
        this.formInline.category3
      );
    },
  },
  mounted() {
    this.getcategory1();
  },
  methods: {
    getcategory1() {
      this.$store
        .dispatch("attr/reqgetCategory1")
        .then((response) => {
          this.formInline.category1List = response;
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: "error",
          });
        });
    },
    getcategory2() {
      this.$store
        .dispatch("attr/reqgetCategory2", {
          category1Id: this.formInline.category1,
        })
        .then((response) => {
          this.formInline.category2List = response;
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: "error",
          });
        });
    },
    getcategory3() {
      this.$store
        .dispatch("attr/reqgetCategory3", {
          category2Id: this.formInline.category2,
        })
        .then((response) => {
          this.formInline.category3List = response;
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: "error",
          });
        });
    },
    clearcategory2() {
      this.formInline = {
        ...this.formInline,
        category2: "",
        category3: "",
        category3List: [],
      };
    },
    clearcategory3() {
      this.formInline.category3 = "";
    },
  },
};
</script>

<style>
</style>