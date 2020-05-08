<template>
  <view class="content">
    <scroll-view class="discussDetail" scroll-y="true">
      <view class="logTitle">
        <text class="iconfont icon-zuixin"></text>最新热评
      </view>
      <view v-if="!discussLength" style="background-color:#fff;text-align:center">赶紧来占个沙发吧！</view>
      <view class="logContent" v-for="(item,index) in discussList" :key="index">
        <view v-if="discussLength" class="logContentHead">
          <view class="userHeadImage">
            <image :src="item.userImg" mode="widthFix" />
          </view>
          <view class="userMegs">
            <view>{{item.nickName}}</view>
            <view style="color:#7a7e83;font-size:18rpx">
              {{item.time}}
              <text style="font-size:20rpx">发表</text>
            </view>
          </view>
        </view>
        <scroll-view scroll-y="true" class="logContentNav">
          <view>{{item.userMegs}}</view>
        </scroll-view>
        <!-- <view class="logContentNav">
        </view>-->
      </view>
    </scroll-view>
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
import moment from "moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      show: false,
      discuss_id: "",
      userInfo: "",
      discussMegs: "",
      discussList: "",
      discussLength: null //日志总条数
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
        res.map(v => {
          v.time = moment(v.time).format("YYYY-M-DD HH:mm:ss");
          console.log(v.time, "相对时间");
          return v;
        });
        t.discussList = res;
        console.log(t.discussList, "评论列表");
        t.discussLength = res.length;
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
          t.getDiscussList();
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
  .discussDetail {
    max-height: 90vh;
    border-bottom: 2rpx solid #a2a2a2;
    .logTitle {
      padding: 10rpx;
      font-size: 28rpx;
      height: 50rpx;
      line-height: 50rpx;
      background-color: #fff;
    }
    .logContent {
      border-bottom: 4rpx solid #f8f8f8;
      background-color: #fff;

      .logContentHead {
        display: flex;
        flex-direction: row;

        .userHeadImage {
          padding-top: 10rpx;
          padding-left: 20rpx;

          image {
            width: 100rpx;
            height: 100rpx;
            border-radius: 100%;
          }
        }

        .userMegs {
          margin: auto 0;
          padding-left: 20rpx;
        }
      }

      .logContentNav {
        padding-left: 140rpx;
        max-height: 160rpx;
        color: #292c32;
        font-size: 28rpx;
        box-sizing: border-box;
      }

      .openTag {
        position: absolute;
        bottom: 0rpx;
        right: 5rpx;
        color: #00a2ff;
        box-shadow: -30rpx 0rpx 10rpx rgba(255, 255, 255, 0.8);
        background-color: rgb(255, 255, 255);
      }

      .open {
        position: relative;
        padding-left: 100rpx;
        font-size: 28rpx;
      }
    }
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