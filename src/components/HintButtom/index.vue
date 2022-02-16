<template>
  <a :title="title">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "HintButtom",
  props: ["title"],
};
</script>

<style  scoped>
a {
  margin-right: 10px;
}
</style>