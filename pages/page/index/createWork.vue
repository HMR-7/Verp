<template>
  <view class="content">
    <input class="workTitle" type="text" placeholder="请输入作业标题" v-model="workTitle" />
    <view>
      <textarea class="workMegs" maxlength="-1" placeholder="请输入作业内容" v-model="workMegs"></textarea>
    </view>
    <view class="confirm" @tap="toConfirmWork">完成</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      course_id: "",
      creater: "",
      workTitle: "",
      workMegs: ""
    };
  },
  onLoad(option) {
    let t = this;
    console.log(option);
    
    t.creater = option.creater;
    t.course_id = option.course_id;
  },
  methods: {
    toConfirmWork() {
      let t = this;
      let data = {
        course_id: t.course_id,
        creater: t.creater,
        workTitle: t.workTitle,
        workMegs: t.workMegs
      };
      t.$utils.ajax(t.$api.toAddWorkMegs, "post", data, res => {
        console.log(res);
        t.$utils.showToast(res.msg);
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
  .workTitle {
    margin-top: 20rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-bottom: 2rpx solid #a2a2a2;
  }
  .workMegs {
    margin-top: 40rpx;
    width: 100%;
    background-color: var(--contentBgc);
  }
  .confirm {
    margin: 0 auto;
    margin-top: 60rpx;
    width: 400rpx;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    text-align: center;
    border-radius: 100rpx;
    background-color: var(--themeColor);
  }
}
</style>