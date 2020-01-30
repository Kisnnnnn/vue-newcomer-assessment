<template>
  <el-container class="home"
    style="height: 100vh">
    <el-aside width="200px"
      style="height:100vh;">
      <el-menu style="height:100vh;border:0;"
        router
        background-color="#304156"
        text-color="#BFCBD9"
        active-text-color="#409EFF"
        :default-active="menuIndex">
        <el-menu-item index="/add">
          添加考核
        </el-menu-item>
        <el-menu-item index="/list">
          考核库
        </el-menu-item>
        <el-menu-item index="/my-exam">
          我的考核
        </el-menu-item>
        <el-menu-item index="/start">
          开始考核
        </el-menu-item>
        <el-menu-item index="/my-check">
          填写考核结果
        </el-menu-item>
        <el-menu-item index="/result">
          考核结果查询
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="50">
        <h4>新人考核系统</h4>
        <el-dropdown @command="handleCommand">
          <div>
            <i class="el-icon-s-grid"
              style="margin-right: 5px;font-size:20px;color:#409EFF;"></i>
            <span class="menu-name">{{user.username}}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="myExam">查看我的考核</el-dropdown-item>
            <el-dropdown-item command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
.home {
  .el-header {
    display: flex;
    justify-content: space-between;
    position: relative;
    background-color: #fafafa;
    line-height: 50px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    font-size: 20px;
    & > h4 {
      margin: 0;
      height: 50px;
      line-height: 50px;
      display: inline-block;
      margin-block-start: 0;
      margin-block-end: 0;
    }
    .menu-name {
      font-size: 20px;
      color: #333;
    }
  }
  & > .el-container {
    & > .el-main {
      height: calc(100vh - 52px);
      padding: 0;
    }
  }
}
</style>

<script>
import AV from 'leancloud-storage';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'home',
  components: {},
  data() {
    return {
      menuIndex: '/list'
    };
  },
  created() {
    if (!this.user) {
      this.$notify({
        message: '登录状态失效，请重新登录！',
        type: 'warning'
      });
      this.$router.replace({
        path: '/login'
      });
    }
  },
  computed: {
    ...mapState({ user: 'userData' })
  },
  methods: {
    ...mapMutations({
      clearUser: 'clearUser'
    }),
    handleCommand(e) {
      this[e]();
    },
    myExam() {
      this.menuIndex = '/my-exam';
      this.$router.push('/my-exam');
    },
    logout() {
      this.$notify({
        message: '注销成功！',
        type: 'warning'
      });
      AV.User.logOut().then(() => {
        this.clearUser();
        this.$router.replace({
          path: '/login'
        });
      });
    }
  }
};
</script>
