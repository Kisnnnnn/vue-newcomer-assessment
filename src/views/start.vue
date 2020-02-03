<template>
  <div>
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
            <el-button type="primary"
              @click="handleStart(scope.row)">进入考核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
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
  data() {
    return {
      originData: []
    };
  },
  computed: {
    ...mapState({ userData: 'userData', typeList: 'typeList' }),
    tableData() {
      return this.originData.map((item, index) => item._serverData);
    }
  },
  methods: {
    getListData() {
      //   ListApi.equalTo('issuer', this.userData.username);
      ListApi.find().then(
        data => {
          this.originData = data.filter(({ _serverData, id, updatedAt }) => {
            if (_serverData.dateRange[1].valueOf() > new Date().valueOf()) {
              return Object.assign(_serverData, {
                id: id,
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
            }
          });
          console.log(this.originData);
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
    handleStart(data) {
      this.$router.push({
        path: '/start-detail',
        query: {
          examId: data.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
