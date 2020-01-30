<template>
  <div class="form">
    <el-form ref="form"
      :model="form"
      :rules="rules"
      label-width="80px">
      <el-form-item prop="name"
        required
        label="考核名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="desc"
        required
        label="考核介绍">
        <el-input type="textarea"
          v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item prop="type"
        required
        label="技术类型">
        <el-select v-model="form.type"
          placeholder="请选择技术类型">
          <el-option :label="item.text"
            v-for="(item, index) in typeList"
            :key="index"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="mdValue"
        required
        label="考核内容">
        <div class="markdown"
          :toolbars="toolbars">
          <Markdown v-model="form.mdValue" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          size="medium"
          style="width:100px;"
          @click="validData">立即创建</el-button>
        <!-- <el-button @click="cancel">取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<style coped lang="scss">
.form {
  padding: 20px;
}
</style>

<script>
import Markdown from 'vue-meditor';
import AV from 'leancloud-storage';
import { mapState } from 'vuex';

export default {
  name: 'home',
  components: {
    Markdown
  },
  data() {
    return {
      form: {
        name: '',
        desc: '',
        type: '',
        mdValue: ''
      },
      rules: {
        name: [{ required: true, message: '请输入考核名称', trigger: 'click' }],
        desc: [{ required: true, message: '请输入考核介绍', trigger: 'click' }],
        mdValue: [
          { required: true, message: '请输入考核内容', trigger: 'click' }
        ],
        type: [{ required: true, message: '请输入考核类型', trigger: 'click' }]
      },
      toolbars: {
        h4: true,
        h5: true,
        clear: true
      }
    };
  },
  computed: {
    ...mapState({
      user: 'userData',
      typeList: 'typeList'
    })
  },
  methods: {
    validData() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.onSubmit();
        } else {
          return false;
        }
      });
    },
    onSubmit() {
      const List = AV.Object.extend('List');
      const ListApi = new List();

      ListApi.set(this.form);
      ListApi.set('author', this.user.username);
      ListApi.save().then(
        todo => {
          this.$notify({
            message: '保存成功。',
            type: 'success'
          });
        },
        error => {
          // 异常处理
          this.$notify({
            message: `请求错误！原因：${error}`,
            type: 'warning'
          });
        }
      );
    }
  }
};
</script>
