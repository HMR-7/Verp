<template>
  <view class="content">
    <view class="title">课程</view>
    <input type="text" v-model="courseName" placeholder="请输入课程名称" class="className" />
    <view class="title" style="margin-top:50rpx">班级</view>
    <input type="text" v-model="className" placeholder="请输入班级名称" class="className" />
    <view class="confirm" @tap="toCreateClass">完成</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: "",
      courseName: "",
      className: ""
    };
  },
  onLoad() {
    let t = this;
    t.userInfo = uni.getStorageSync("userInfo");
  },
  methods: {
    /* 创建课程 */
    toCreateClass() {
      let t = this,
        userInfo = t.userInfo;
      if (t.courseName == "") {
        t.$utils.showToast("请输入课程名");
        return;
      }
      if (t.className == "") {
        t.$utils.showToast("请输入班级名");
        return;
      }
      let data = {
        user_id: userInfo.id,
        creater: userInfo.nickName,
        courseName: t.courseName,
        className: t.className
      };
      t.$utils.ajax(t.$api.createClass, "post", data, res => {
        console.log(res);
        if (res.flag == "had") {
          t.$utils.showToast(res.msg);
          return;
        }
        t.$utils.showToast(res.msg + "即将跳转首页");
        setTimeout(() => {
          uni.switchTab({
            url: "./index"
          });
        }, 1500);
      });
    }
  }
};
</script>

<style lang="less">
.content {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--contentBgc);
  padding: 40rpx;
  .title {
    font-size: var(--titleSize);
    font-weight: bolder;
  }
  .className {
    margin-top: 20rpx;
    height: 80rpx;
    border-bottom: 2rpx solid #c0c0c0;
  }
  .confirm {
    margin: 0 auto;
    margin-top: 100rpx;
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