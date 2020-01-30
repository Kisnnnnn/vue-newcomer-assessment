<template>
  <div class="detail">
    <el-row>
      <el-col :span="4">
        考核名称:
      </el-col>
      <el-col :span="20">
        {{form.name}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        考核介绍:
      </el-col>
      <el-col :span="20">
        {{form.desc}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        技术类型:
      </el-col>
      <el-col :span="20">
        {{examType}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        考核内容:
      </el-col>
      <el-col :span="20">
        <div class="markdown">
          <Markdown isPreview
            v-model="form.mdValue" />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary"
          @click="next">下一步</el-button>
        <el-button>取消</el-button>
      </el-col>
    </el-row>
    <!-- 选择用户 -->
    <el-popover placement="top"
      popper-class="user-frame"
      v-model="userShow"
      trigger="click">
      <div class="user">
        <div class="user-title">
          <span>选择用户</span>
          <i @click="onCloseUser"
            style="font-syuize:20px"
            class="el-icon-close"></i>
        </div>
        <user @userValue="userValue"></user>
        <div class="date">
          <div class="date-name">
            考试时间：
          </div>
          <el-date-picker @change="changeDateRange"
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="exam-date">考试时间：<span class="red">{{examTime||'请选择时间'}}</span></div>
        <div>
          <el-button @click="sendToUser"
            type="primary">发送</el-button>
          <el-button @click="cancelToUser">取消</el-button>
        </div>
      </div>
    </el-popover>
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
import user from '../components/user';
export default {
  name: 'home',
  components: {
    Markdown,
    user: user
  },
  data() {
    return {
      id: this.$route.query.id,
      form: {},
      dateRange: [],
      examTime: '',
      examUserEmail: '',
      userShow: false
    };
  },
  created() {
    const ListApi = new AV.Query('List');

    ListApi.equalTo('objectId', this.id);
    ListApi.find().then(resData => {
      this.form = resData[0]._serverData;
    });
  },
  computed: {
    ...mapState({
      userData: 'userData',
      typeList: 'typeList'
    }),
    examType() {
      return this.form.type
        ? this.typeList.filter(item => item.value === this.form.type)[0].text
        : '暂无类型';
    }
  },
  methods: {
    onCloseUser() {
      this.userShow = false;
    },
    changeDateRange(e) {
      this.examTime = (e[1].valueOf() - e[0].valueOf()) / 1000 / 60 + 'min';
    },
    next() {
      this.userShow = true;
    },
    sendToUser() {
      if (this.examUserEmail === '') {
        return this.$alert('请选择需要考核的人员', '提示');
      }
      if (this.dateRange.length < 2) {
        return this.$alert('请选择考核日期！', '提示');
      }

      const Examine = AV.Object.extend('Examine');
      const ExamineApi = new Examine();

      ExamineApi.set('exmaId', this.id);
      ExamineApi.set('issuer', this.userData.username);
      ExamineApi.set('examUserEmail', this.examUserEmail);
      ExamineApi.set('examTime', this.examTime);
      ExamineApi.set('dateRange', this.dateRange);
      ExamineApi.set('exmaData', this.form);

      ExamineApi.save().then(
        todo => {
          this.$notify({
            message: '提交成功，并发送邮件！',
            type: 'success'
          });
          this.$router.replace('/');
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
    cancelToUser() {
      this.userShow = false;
      this.dateRange = [];
      this.examTime = '';
    },
    userValue(e) {
      this.examUserEmail = e;
    }
  }
};
</script>
<style lang="scss">
.detail {
  color: #606266;
  padding: 20px 25px;
  & > .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .user-frame {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 98;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    .user {
      width: 400px;
      height: 90vh;
      position: fixed;
      z-index: 99;
      left: calc(50vw - 200px);
      top: 5vh;
      background-color: #fff;
      border-radius: 5px;
      padding: 11px 15px;
      .user-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 40px;
        margin-bottom: 10px;
        font-size: 18px;
      }
      & > .date {
        display: flex;
        flex-direction: column;
        .date-name {
          line-height: 60px;
          font-size: 18px;
        }
      }
      & > .exam-date {
        font-size: 18px;
        line-height: 60px;
        .red {
          color: #ce3826;
        }
      }
    }
  }
}
</style>
