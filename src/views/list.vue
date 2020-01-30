<template>
  <el-container class="list">
    <el-main>
      <el-table :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="name"
          label="考核名称"
          width="200">
        </el-table-column>
        <el-table-column prop="desc"
          label="考核介绍">
        </el-table-column>
        <el-table-column align="center"
          prop="type"
          width="90"
          label="技术类型">
        </el-table-column>
        <el-table-column align="center"
          prop="author"
          width="80"
          label="发布者">
        </el-table-column>
        <el-table-column align="center"
          prop="updateTime"
          width="100"
          label="更新日期">
        </el-table-column>
        <el-table-column align="center"
          label="操作"
          width="240">
          <template slot-scope="scope">
            <el-button @click="handleLook(scope.row)"
              size="small">查看</el-button>
            <el-button @click="handleEdit(scope.row)"
              type="primary"
              size="small">编辑</el-button>
            <el-button type="warning"
              size="small"
              @click="handleDelete(scope.row)">删除</el-button>
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
</template>

<style lang="scss">
.list {
  padding: 0;
  .el-main {
    height: calc(100vh - 60px - 52px);
  }
  .el-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<script>
import AV from 'leancloud-storage';
import { mapState } from 'vuex';
export default {
  name: 'home',
  components: {},
  data() {
    return {
      allData: [],
      curPage: 1,
      totalNum: 0
    };
  },
  created() {
    const ListApi = new AV.Query('List');

    ListApi.find().then(
      data => {
        this.allData = data.map(({ _serverData, id, updatedAt }) => {
          _serverData.type = this.typeList[_serverData.type];

          return Object.assign(
            _serverData,
            { id: id },
            { updateTime: updatedAt.toLocaleString().split(' ')[0] }
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
  watch: {},
  computed: {
    ...mapState({
      typeList: 'typeList'
    }),
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
        path: '/detail',
        query: {
          id: e.id
        }
      });
    },
    handleEdit(e) {
      this.$router.push({
        path: '/edit',
        query: {
          id: e.id
        }
      });
    },
    handleDelete(e) {
      const List = AV.Object.createWithoutData('List', e.id);

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        List.destroy().then(res => {
          // 异常处理
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.allData = this.allData.filter(item => e.id !== item.id);
        });
      });
    }
  }
};
</script>
