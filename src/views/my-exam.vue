<template>
  <div>
    <el-container class="list">
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
            prop="issuer"
            width="80"
            label="发布者">
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
            width="110">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isDone"
                @click="handleLook(scope.row)"
                type="success"
                size="small">查看成绩</el-button>
              <el-button v-else
                @click="handleStart(scope.row)"
                type="primary"
                size="small">开始考试</el-button>
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

export default {
  name: 'MyExam',
  components: {},
  created() {
    const ListApi = new AV.Query('Examine');

    ListApi.equalTo('examUserEmail', this.userData.email);
    ListApi.find().then(
      data => {
        this.allData = data.map(({ _serverData, id, updatedAt }) => {
          let isDone = false;

          if (_serverData.dateRange[1].valueOf() < new Date().valueOf()) {
            isDone = true;
          }

          return Object.assign(
            _serverData,
            { id: id },
            { isDone: isDone },
            {
              startTime: moment(_serverData.dateRange[0]).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              endTime: moment(_serverData.dateRange[1]).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }
          );
        });
        this.totalNum = this.allData.length;
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
  data() {
    return {
      allData: [],
      curPage: 1,
      totalNum: 0
    };
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
    handleLook(e) {
      this.$router.push({
        path: '/exam-result',
        query: {
          examId: e.exmaId,
          resultId: e.id
        }
      });
    }
  }
};
</script>
