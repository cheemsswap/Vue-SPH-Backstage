<template>
  <div class="attr-container">
    <el-card><CategorySelect @getCategory="getCategory" /> </el-card>
    <el-card>
      <el-button
        :disabled="!isAdd"
        @click="addAttrInfo"
        type="primary"
        icon="el-icon-plus"
        >添加属性</el-button
      >
      <el-table :data="attrInfoList" border style="width: 100%">
        <el-table-column align="center" prop="id" label="序号" width="100">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="180">
        </el-table-column>
        <el-table-column prop="attrValueList" label="属性值列表">
          <template slot-scope="scope">
            <el-tag
              style="margin-right: 3px"
              type="success"
              :key="attrValue.id"
              v-for="attrValue of scope.row.attrValueList"
            >
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="DialogForm.title" :visible.sync="DialogForm.visible">
      <el-form
        :model="DialogForm.value"
        :rules="DialogFormRules"
        ref="DialogForm"
      >
        <el-form-item label="属性ID" :label-width="DialogForm.formLabelWidth">
          <el-input
            disabled
            v-model="DialogForm.value.id"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="attrName"
          label="属性名称"
          :label-width="DialogForm.formLabelWidth"
        >
          <el-input
            v-model="DialogForm.value.attrName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="dynamicTags"
          label="属性值"
          :label-width="DialogForm.formLabelWidth"
        >
          <template>
            <el-tag
              :key="tag"
              v-for="tag in DialogForm.value.dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="DialogForm.value.inputVisible"
              v-model="DialogForm.value.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ New Tag</el-button
            >
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAttrInfo">取 消</el-button>
        <el-button type="primary" @click="saveAttrInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    const validateAttrName = (rule, value, callback) => {
      if (value && value.length >= 1 && value.length <= 12) {
        callback();
      } else {
        callback(new Error("请输入1~12个字符的属性名称"));
      }
    };
    const validatedynamicTags = (rule, value, callback) => {
      if (value.length) {
        callback();
      } else {
        callback(new Error("请添加至少1个属性值"));
      }
    };
    return {
      attrInfoList: [],
      isAdd: false,
      DialogForm: {
        visible: false,
        title: "",
        formLabelWidth: "120px",
        value: {
          id: "",
          attrName: "",
          dynamicTags: [],
          inputVisible: false,
          inputValue: "",
        },
      },
      DialogFormRules: {
        attrName: [
          { required: true, trigger: "change", validator: validateAttrName },
        ],
        dynamicTags: [
          { required: true, trigger: "blur", validator: validatedynamicTags },
        ],
      },
    };
  },
  methods: {
    getCategory(category1, category2, category3) {
      if (category3)
        this.$store
          .dispatch("attr/reqgetattrInfoList", {
            category1Id: category1,
            category2Id: category2,
            category3Id: category3,
          })
          .then((response) => {
            this.isAdd = true;
            this.attrInfoList = response.filter((element) => {
              //只显示三级分类
              return element.categoryLevel == 3;
            });
          })
          .catch((error) => {
            this.$message({
              message: error,
              type: "error",
            });
          });
      else {
        this.attrInfoList = [];
        this.isAdd = false;
      }
    },
    addAttrInfo() {
      this.$refs.DialogForm && this.$refs.DialogForm.clearValidate();
      this.DialogForm = {
        ...this.DialogForm,
        title: "新增属性",
        visible: true,
      };
    },
    cancelAttrInfo() {
      this.$refs.DialogForm && this.$refs.DialogForm.resetFields();
      this.DialogForm = {
        ...this.DialogForm,
        visible: false,
      };
    },
    saveAttrInfo() {
      //校验
      this.$refs.DialogForm.validate((valid) => {
        //判断校验是否成功
        console.log(valid);
      });
    },
    handleClose(tag) {
      this.DialogForm.value.dynamicTags.splice(
        this.DialogForm.value.dynamicTags.indexOf(tag),
        1
      );
    },
    showInput() {
      this.DialogForm.value.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.DialogForm.value.inputValue;
      //无法插入相同的
      if (
        inputValue &&
        this.DialogForm.value.dynamicTags.indexOf(inputValue) == -1
      ) {
        this.DialogForm.value.dynamicTags.push(inputValue);
      }
      this.DialogForm.value.inputVisible = false;
      this.DialogForm.value.inputValue = "";
    },
  },
};
</script>

<style  lang="scss" scoped>
.attr {
  &-container {
    margin: 30px;
    padding-top: 10px;
    .el-card {
      margin-bottom: 30px;
      .el-button {
        margin-bottom: 10px;
      }
    }
  }
}
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