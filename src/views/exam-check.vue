<template>
  <div>
    <div class="info">
      <el-row>
        <el-col :span="4">
          考核名称:
        </el-col>
        <el-col :span="20">
          {{examData.name}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          考核介绍:
        </el-col>
        <el-col :span="20">
          {{examData.desc}}
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
          <el-button size="mini"
            type="primary"
            @click="mdShow=true">点击查看</el-button>
        </el-col>
      </el-row>
      <!-- 添加错误 -->
      <div class="add-error-container">
        <el-row>
          <el-col :span="24"
            class="title">
            添加错误
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            错误描述:
          </el-col>
          <el-col :span="21">
            <el-input v-model="errAddForm.errorDescr"
              type="textarea"
              :rows="3"
              size="small"
              placeholder="请输入错误描述(必填）"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            错误图示:
          </el-col>
          <el-col :span="16">
            <el-input v-model="errAddForm.errorUrl"
              size="small"
              placeholder="请输入图片地址"></el-input>
          </el-col>
          <el-col :span="1"
            :offset="2">
            扣分:
          </el-col>
          <el-col :span="2">
            <el-input v-model="errAddForm.errorScore"
              size="small"
              placeholder="请输入分数"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"
            :offset="16"
            style="text-align:right;">
            <el-button type="primary"
              style="width:80px;"
              @click="onAddError">添加</el-button>
          </el-col>
        </el-row>
      </div>

      <div v-show="mdShow"
        class="markdown">
        <div class="user-title">
          <span>考核内容</span>
          <i @click="mdShow=false"
            style="font-syuize:20px"
            class="el-icon-close"></i>
        </div>
        <Markdown isPreview
          class="md-content"
          v-model="examData.mdValue" />
      </div>
    </div>
    <div class="detail">
      <el-table :data="tableData"
        border
        style="width: 100%">
        <el-table-column type="index"
          width="50">
        </el-table-column>
        <el-table-column prop="errorDescr"
          label="错误描述"
          width="200">
        </el-table-column>
        <el-table-column prop="errorUrl"
          label="错误图示">
        </el-table-column>
        <el-table-column prop="errorScore"
          width="50"
          label="扣分">
        </el-table-column>
        <el-table-column align="center"
          prop="errorAuthor"
          width="80"
          label="填写者">
        </el-table-column>
        <el-table-column align="center"
          label="操作"
          width="110">
          <template slot-scope="scope">
            <el-button @click="handleLook(scope.row)"
              type="primary"
              size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="padding-right:20px;text-align:right;">
      <el-button type="success"
        style="width:120px;"
        @click="onAddError">完成填写</el-button>
    </div>
  </div>
</template>
<script>
import Markdown from 'vue-meditor';
import AV from 'leancloud-storage';
import { mapState } from 'vuex';
export default {
  components: { Markdown },
  created() {
    //   获取考试信息
    const ListApi = new AV.Query('List');
    const errorListApi = new AV.Query('Examine');

    ListApi.equalTo('objectId', this.examId);
    ListApi.find().then(data => {
      this.examData = data[0]._serverData;
    });

    errorListApi.equalTo('objectId', this.resultId);
    errorListApi.find().then(data => {
      this.tableData = data[0]._serverData.errList;
    });
  },
  data() {
    return {
      examData: {},
      errAddForm: {},
      tableData: [],
      mdShow: false,
      resultId: this.$route.query.resultId,
      examId: this.$route.query.examId
    };
  },
  computed: {
    ...mapState({ userData: 'userData', typeList: 'typeList' }),
    examType() {
      return this.examData.type
        ? this.typeList.filter(item => item.value === this.examData.type)[0]
          .text
        : '暂无类型';
    }
  },
  methods: {
    onAddError() {
      if (!this.errAddForm.errorDescr || this.errAddForm.errorDescr === '') {
        return this.$message({
          message: '请输入错误描述！',
          type: 'warning'
        });
      }

      if (!this.errAddForm.errorScore || this.errAddForm.errorScore === '') {
        return this.$message({
          message: '请输入扣分！',
          type: 'warning'
        });
      }

      let ExamineApi = AV.Object.createWithoutData(
        'Examine',
        this.resultId,
        'errList'
      );
      let data = this.errAddForm;

      data.errorAuthor = this.userData.username;
      ExamineApi.add('errList', data);
      ExamineApi.save();

      this.tableData.push(this.errAddForm);
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  color: #606266;
  padding: 20px 25px;
  border-bottom: 1px solid #ececec;
  font-size: 16px;
  & > .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  & > .add-error-container {
    font-size: 14px;
    border-radius: 5px;
    & > .el-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      & > .title {
        font-size: 18px;
        margin-bottom: 10px;
        color: #409eff;
        font-weight: 450;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.markdown {
  position: fixed;
  z-index: 99;
  left: 10vw;
  top: 10vh;
  height: 650px;
  width: 80vw;
  border: 1px solid #ececec;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0px 4px #fafafa;
  & > .user-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 50px;
    background-color: #fafafa;
    font-size: 18px;
    padding: 0 20px;
    border-bottom: 1px solid #cecece;
  }
  & > .md-content {
    top: calc(10vh + 50px);
    border: 0;
  }
}
</style>
