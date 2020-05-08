<template>
  <view class="content">
    <scroll-view class="workDetail" scroll-y="true">{{workMegs}}</scroll-view>
    <view v-if="!hadAnswer">
      <textarea class="answer" placeholder="请在此作答" maxlength="-1" v-model="answer"></textarea>
      <view class="confirm" @tap="confirm">提交</view>
    </view>
    <view v-if="hadAnswer">
      <view class="myAnswer">我的回答</view>
      <textarea class="answer" :placeholder="hadAnswer.answer" maxlength="-1" disabled="true"></textarea>
      <view class="grade" v-if="!hadAnswer.grade">
        <text>我的分数：</text>
        <text style="color:red">暂未评分！</text>
      </view>
      <view v-else class="grade">
        <text>我的分数：</text>
        <text style="color:red">{{hadAnswer.grade}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: "", //用户信息
      workDetail: "", //课程详情
      workMegs: "", //作业详情
      answer: "", //学生答案
      hadAnswer: "" //已提交的答案
    };
  },
  onLoad(options) {
    let t = this;
    let list = JSON.parse(options.obj);
    t.userInfo = uni.getStorageSync("userInfo");
    t.workDetail = list;
    console.log(list);

    t.$utils.setAppTitile(list.workTitle);
    t.workMegs = list.workMegs;
    t.getAnswer();
  },
  methods: {
    confirm() {
      let t = this,
        workDetail = t.workDetail;
      if (t.answer == "") {
        t.$utils.showToast("请输入内容！");
        return;
      }
      let data = {
        studentName: t.userInfo.nickName,
        student_id: t.userInfo.id,
        work_id: workDetail.work_id,
        course_id: workDetail.course_id,
        answer: t.answer
      };
      t.$utils.ajax(t.$api.addWorkAnswer, "post", data, res => {
        t.$utils.showToast(res.msg);
        t.getAnswer();
      });
    },
    getAnswer() {
      let t = this,
        workDetail = t.workDetail;
      let data = {
        student_id: t.userInfo.id,
        work_id: workDetail.work_id
      };
      t.$utils.ajax(t.$api.getStudentAnswer, "get", data, res => {
        console.log(res, "自己的答案");
        t.hadAnswer = res;
      });
    }
  }
};
</script>

<style lang='less'>
.content {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20rpx;
  .workDetail {
    max-height: 300rpx;
    box-sizing: border-box;
    text-align: center;
    font-size: var(--titleSize);
    font-weight: bolder;
  }
  .answer {
    margin: 40rpx 0;
    width: 100%;
    height: 400rpx;
    background-color: var(--contentBgc);
  }
  .confirm {
    background-color: #4cd964;
    padding: 5rpx 10rpx;
    border-radius: 10rpx;
    color: #fff;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 50rpx;
  }
  .myAnswer {
    margin-top: 40rpx;
    color: var(--themeColor);
    text-align: center;
    font-size: var(--navFontSize);
    font-weight: bolder;
  }
  .grade {
    font-size: var(--bigTitleSize);
    color: royalblue;
    text-align: center;
  }
}
</style>