<template>
  <view class="content">
    <view class="addWork" @tap="show=true">发布评论</view>
    <van-popup :show="show" position="bottom" @close="show=false" custom-style="padding:20rpx">
      <textarea
        v-model="discussMegs"
        maxlength="-1"
        placeholder="请输入随机内容"
        style="background-color: var(--contentBgc);width:100%"
      ></textarea>
      <view class="comfirm" @tap="comfirm">发布</view>
    </van-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      discuss_id: "",
      userInfo: "",
      discussMegs: "",
      discussList: ""
    };
  },
  onLoad(options) {
    let t = this;
    t.userInfo = uni.getStorageSync("userInfo");
    t.course_id = options.course_id;
    t.discuss_id = options.discuss_id;
    t.$utils.setAppTitile(options.title);
    console.log(options);
    t.getDiscussList();
  },
  methods: {
    getDiscussList() {
      let t = this;
      let data = {
        discuss_id: t.discuss_id
      };
      t.$utils.ajax(t.$api.getAllDiscussList, "get", data, res => {
        t.discussList = res;
        console.log(t.discussList, "评论列表");
      });
    },
    comfirm() {
      let t = this,
        userInfo = t.userInfo;
      if (t.discuss_id == "") {
        t.$utils.showToast("内容不能为空！");
        return;
      }
      let data = {
        nickName: userInfo.nickName,
        userImg: userInfo.avatarUrl,
        userMegs: t.discussMegs,
        course_id: t.course_id,
        discuss_id: t.discuss_id
      };
      t.$utils.ajax(t.$api.addDiscussMegs, "post", data, res => {
        t.$utils.showToast(res.msg);
        if (res.flag == "yes") {
          t.show = false;
        }
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
  .addWork {
    position: fixed;
    top: 93%;
    left: calc(50% - 200rpx);
    width: 400rpx;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    text-align: center;
    border-radius: 100rpx;
    background-color: var(--themeColor);
  }
  .comfirm {
    margin: 0 auto;
    margin-top: 20rpx;
    width: 400rpx;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    text-align: center;
    border-radius: 100rpx;
    background-color: #4cd964;
  }
}
</style>