<template>
  <div class="frame">
    <div class="tit">注册</div>
    <el-form ref="form"
      :model="form"
      required
      :rules="rules"
      label-width="80px">
      <el-form-item label-width="60"
        prop="loginId"
        label="账号">
        <el-input v-model="form.loginId"></el-input>
      </el-form-item>
      <el-form-item label-width="60"
        prop="password"
        required
        label="密码">
        <el-input type="password"
          v-model="form.password"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label-width="60"
        prop="ispassword"
        required
        label="确认密码">
        <el-input type="ispassword"
          v-model="form.ispassword"
          autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label-width="60"
        prop="email"
        required
        label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary"
      @click="register()">注册</el-button>
  </div>
</template>
<style lang="scss" scoped>
.frame {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  //   background-color: #304156;
  .tit {
    line-height: 50px;
    font-size: 22px;
    margin-bottom: 5vw;
    // color: #fff;
  }
  .el-form {
    width: 400px;
  }
  .el-button {
    width: 20%;
    margin-top: 30px;
    margin-left: 0;
  }
}
</style>

<style >
.frame .el-form-item__label {
  /* color: #fff !important; */
  font-size: 16px;
}
</style>

<script>
import AV from 'leancloud-storage';
import { mapMutations } from 'vuex';

export default {
  name: 'login',
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      form: {
        loginId: '',
        password: '',
        ispassword: '',
        email: ''
      },
      rules: {
        loginId: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, message: '长度必须大于4', trigger: 'blur' },
          { max: 14, message: '长度必须小于14', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, message: '长度必须大于5', trigger: 'blur' },
          { max: 14, message: '长度必须小于14', trigger: 'blur' }
        ],
        ispassword: [{ validator: validatePass, trigger: 'blur' }],
        email: [
          {
            type: 'email',
            required: true,
            message: '请输入合法的email地址',
            trigger: 'click'
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    ...mapMutations({
      setUser: 'setUser'
    }),
    register() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 创建实例
          const user = new AV.User();
          const loginId = this.form.loginId;
          const password = this.form.password;
          const email = this.form.email;

          user.setUsername(loginId);
          user.setPassword(password);
          user.setEmail(email);

          user.signUp().then(
            user => {
              this.setUser(user);
              // 注册成功
              this.$notify({
                message: '注册成功',
                type: 'success',
                duration: '1500'
              });
              this.$router.push({
                path: '/registersuccess',
                query: {
                  email: email
                }
              });
            },
            error => {
              this.$notify({
                message: '注册失败。请复制原因：' + error,
                type: 'warning',
                duration: '0'
              });
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>
