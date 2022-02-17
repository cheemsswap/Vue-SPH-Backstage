<template>
  <div v-bind="$attrs" v-on="$listeners">
    <el-tag
      :key="tag.id"
      v-for="tag in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag.saleAttrValueName)"
    >
      {{ tag.saleAttrValueName }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput"
      >+ New Tag</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Tag",
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  props: ["spuSaleAttrValueList"],
  watch: {
    spuSaleAttrValueList() {
      this.dynamicTags = this.spuSaleAttrValueList;
    },
  },
  mounted() {
    this.dynamicTags = this.spuSaleAttrValueList;
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags = this.dynamicTags.filter((Element) => {
        return Element.saleAttrValueName != tag;
      });
      this.$emit("update:spuSaleAttrValueList", this.dynamicTags);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.dynamicTags.indexOf(inputValue) == -1) {
        this.dynamicTags.push({ saleAttrValueName: inputValue });
        this.$emit("update:spuSaleAttrValueList", this.dynamicTags);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>