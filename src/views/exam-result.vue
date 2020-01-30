<template>
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
    <div class="detail">
        
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

    ListApi.equalTo('objectId', this.examId);
    ListApi.find().then(data => {
      this.examData = data[0]._serverData;
    });
  },
  data() {
    return {
      examData: {},
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
  methods: {}
};
</script>

<style lang="scss" scoped>
.info {
  color: #606266;
  padding: 20px 25px;
  border-bottom: 1px solid #ececec;
  & > .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
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
