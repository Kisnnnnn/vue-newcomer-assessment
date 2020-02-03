<template>
  <div class="container">
    <div class="tit">搜索</div>
    <el-row style="width:100%;">
      <el-col :span="10">
        <el-input class="srh-input"
          placeholder="请输入考核名称"
          size="medium"
          v-model="srhForm.name"
          @input="handleSearch"
          clearable>
        </el-input>
      </el-col>
      <el-col offset="4" :span="10">
        <el-input class="srh-input"
          placeholder="请输入被考核者"
          size="medium"
          v-model="srhForm.student"
          @input="handleSearch"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-container class="result-container">
      <el-main>
        <el-table :data="tableData"
          border
          style="width: 100%">
          <el-table-column prop="examData.name"
            label="考核名称"
            width="200">
          </el-table-column>
          <el-table-column prop="examData.desc"
            label="考核介绍">
          </el-table-column>
          <el-table-column align="center"
            prop="student"
            width="80"
            label="被考核者">
          </el-table-column>
          <el-table-column align="center"
            prop="examTime"
            width="90"
            label="考试时长">
          </el-table-column>
          <el-table-column align="center"
            prop="startTime"
            width="160"
            label="开始时间">
          </el-table-column>
          <el-table-column align="center"
            prop="endTime"
            width="160"
            label="结束时间">
          </el-table-column>
          <el-table-column align="center"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="handleLook(scope.row)"
                v-if="!scope.row.isDone">未完成</el-button>
              <el-button @click="handleLook(scope.row)"
                v-else-if="scope.row.isCheckOver">已填写</el-button>
              <el-button @click="handleLook(scope.row)"
                type="primary"
                v-else-if="scope.row.isDone&&!scope.row.isCheckOver&&scope.row.issuer===userData.username">开始填写</el-button>
              <el-button v-else
                @click="handleLook(scope.row)">点击查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="60px">
        <el-pagination background
          layout="prev, pager, next"
          :current-page.sync="curPage"
          :total="totalNum">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import AV from 'leancloud-storage';
import moment from 'moment';

const ListApi = new AV.Query('Examine');
const UserApi = new AV.Query('_User');

export default {
  components: {},
  data() {
    return {
      srhForm: {
        name: '',
        student: ''
      },
      allData: [],
      originData: [],
      curPage: 1,
      totalNum: 0
    };
  },
  created() {
    UserApi.find()
      .then(
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
      )
      .then(() => this.getListData());
  },
  computed: {
    ...mapState({ userData: 'userData', typeList: 'typeList' }),
    tableData() {
      return this.allData.filter(
        (item, index) =>
          index >= (this.curPage - 1) * 10 && index <= this.curPage * 10 - 1
      );
    }
  },
  methods: {
    handleSearch() {
      let srhForm = this.srhForm;

      console.log(srhForm);

      this.allData = this.originData.filter(
        item =>
          item.examData.name.includes(srhForm.name) &&
          item.student.includes(srhForm.student)
      );
    },
    handleLook(e) {
      this.$router.push({
        path: '/exam-check',
        query: {
          examId: e.exmaId,
          resultId: e.id
        }
      });
    },
    getListData() {
      //   ListApi.equalTo('issuer', this.userData.username);
      ListApi.find().then(
        data => {
          this.originData = data.map(({ _serverData, id, updatedAt }) => {
            let isDone = true;
            let isCheckOver = _serverData.isCheckOver || false;

            if (_serverData.dateRange[1].valueOf() > new Date().valueOf()) {
              isDone = false;
            }

            return Object.assign(_serverData, {
              id: id,
              isDone: isDone,
              isCheckOver: isCheckOver,
              student: this.users.filter(
                e => _serverData.examUserEmail === e.email
              )[0].username,
              startTime: moment(_serverData.dateRange[0]).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              endTime: moment(_serverData.dateRange[1]).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            });
          });
          this.totalNum = this.originData.length;
          this.allData = this.originData;
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

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  padding: 0 60px;
  .tit {
    font-size: 20px;
    padding: 30px;
  }
  .srh-input {
    // padding: 0 60px;
  }
  .result-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    & > .el-main {
      padding: 0;
    }
    & > .el-footer {
      padding-top: 20px;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
