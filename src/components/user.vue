<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio v-for="(item, index) in users"
        @change="change"
        :key="index"
        :label="item.email">{{item.username}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import AV from 'leancloud-storage';

export default {
  name: 'user',
  data() {
    return { users: [], radio: '' };
  },
  created() {
    const UserApi = new AV.Query('_User');

    UserApi.find().then(
      results => {
        this.users = results.map(item => item._serverData);
      },
      error => {
        // 异常处理
        this.$notify({
          message: `请求错误！原因：${error}`,
          type: 'warning'
        });
      }
    );
  },
  methods: {
    change(label) {
      this.$emit('userValue', label);
    }
  }
};
</script>

<style scoped>
.el-radio-group {
  display: flex;
  flex-direction: column;
}
.el-radio {
  display: flex;
  margin-bottom: 10px;
}
.el-radio >>> .el-radio__input {
  line-height: 27px;
}
.el-radio >>> .el-radio__label {
  font-size: 20px;
}
</style>
