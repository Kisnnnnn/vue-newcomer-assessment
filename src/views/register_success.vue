<template>
  <div class="body">
    <div class="notice">
      注册成功！验证邮件已发送至<span class="email">{{email}}</span>
      ,请注意查收以及验证！
    </div>
    <div class="tips">
      如一分钟内无法收到邮件，请联系管理员或者点击「重新发送」=>
      <el-button type="primary"
        icon="el-icon-message"
        size="mini"
        circle
        @click="resend()"></el-button>
    </div>
    <el-button type="primary"
      @click="next()"
      class="to-home">已完成验证，请登录！</el-button>
  </div>
</template>
<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.notice {
  padding: 30px;
  width: 80vw;
  border: 1px solid #ececec;
  border-radius: 5px;
  font-size: 18px;
  box-shadow: 0 0 8px #ececec;
  color: #333;
  .email {
    padding: 0 4px;
    margin: 0 4px;
    background-color: #f4faff;
    color: #2c97e8;
    line-height: 24px;
    font-size: 18px;
    border-radius: 4px;
  }
}
.tips {
  margin-top: 20px;
  font-size: 14px;
  background-color: #f4faff;
  border-left: 4px solid #2c97e8;
  padding: 20px;
  color: #666;
  width: 80vw;
}
.to-home {
  margin-top: 50px;
  font-size: 18px;
  text-align: center;
}
</style>
<script>
import AV from 'leancloud-storage';

export default {
  name: 'registersuccess',
  components: {},
  data() {
    return {
      email: this.$route.query.email
    };
  },
  methods: {
    resend() {
      const email = this.email;

      AV.User.requestEmailVerify(email).then(
        res => {
          this.$notify({
            title: '成功',
            message: `已成功发送至${email}`,
            type: 'success'
          });
        },
        err => {
          this.$notify({
            message: '注册失败。请复制原因：' + err,
            type: 'warning',
            duration: '0'
          });
        }
      );
    },
    next() {
      this.$router.push({
        path: '/login'
      });
    }
  }
};
</script>
