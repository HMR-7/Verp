<template>
  <view class="content">
    <scroll-view class="workDetail" scroll-y="true">{{quesMegs}}</scroll-view>
    <view v-if="!hadAnswer">
      <textarea class="answer" placeholder="请在此作答" maxlength="-1" v-model="answer"></textarea>
      <view class="confirm" @tap="confirm">提交</view>
    </view>
    <view v-if="hadAnswer">
      <view class="myAnswer">我的回答</view>
      <textarea class="answer" :placeholder="hadAnswer.answer" maxlength="-1" disabled="true"></textarea>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      quesMegs: "随机问题内容",
      answerStudentMegs: "",
      answer: "", //回答的内容
      hadAnswer: ""
    };
  },
  onLoad(options) {
    let t = this;
    let answerStudentMegs = JSON.parse(options.studentMegs);
    t.answerStudentMegs = answerStudentMegs;
    t.quesMegs = answerStudentMegs.questionMegs;
    console.log(answerStudentMegs);
    t.getMyAnswer();
  },
  methods: {
    confirm() {
      let t = this,
        answerStudentMegs = t.answerStudentMegs;
      let data = {
        course_id: answerStudentMegs.course_id,
        student_id: answerStudentMegs.answer_user_id,
        question_id: answerStudentMegs.id,
        answer: t.answer
      };
      t.$utils.ajax(t.$api.addQuesAnswer, "post", data, res => {
        t.$utils.showToast(res.msg);
        t.getMyAnswer();
      });
    },
    getMyAnswer() {
      let t = this,
        userInfo = uni.getStorageSync("userInfo"),
        answerStudentMegs = t.answerStudentMegs;
      console.log(answerStudentMegs.id, "question_id");
      console.log(userInfo.id, "userInfo_id");

      let data = {
        question_id: answerStudentMegs.id,
        student_id: userInfo.id
      };
      t.$utils.ajax(t.$api.getStuQuesAnswer, "get", data, res => {
        console.log(res, "回答的内容");
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
    padding: 20rpx 0 0 20rpx;
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
}
</style>