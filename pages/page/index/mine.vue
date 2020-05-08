<template>
  <view class="content" v-if="isLogin">
    <!-- 用户信息展示模块 -->
    <view class="top_header" @tap="toPerMegs(userInfo.id)">
      <!-- 用户头像 -->
      <image class="header" :src="userInfo.avatarUrl" @tap="toEdit" />
      <!-- 用户昵称、所在城市 -->
      <view class="name_box">
        <view class="box_top">
          <view class="name">{{userInfo.nickName}}</view>
        </view>
        <view class="userCity">City:{{userInfo.city}}</view>
      </view>
    </view>
    <!-- 学生中心 -->
    <view class="header_title">学生中心</view>
    <view class="service">
      <view class="service_line">
        <button open-type="contact" hover-class="none">
          <view class="iconfont icon-weixin1"></view>
          <view class="caption">微信客服</view>
        </button>
      </view>
     
      <view class="service_line" @tap="show=true">
        <view class="iconfont icon-credentials_icon"></view>
        <view class="caption">真实姓名</view>
      </view>
    </view>
    <!--  -->
    <van-popup :show="show" position="bottom" custom-style="height: 20%" @close="show=false">
      <view>
        <view style="margin: 20rpx 0;display:flex;flex-direction:row">
          <view style="margin:0 auto;display:flex;line-height: 70rpx;">
            姓名：
            <input v-model="realName" class="addValue" type="text" placeholder="请输入真实姓名" />
          </view>
        </view>
      </view>
      <view
        @tap="toWriteRealName"
        class="sumBtm"
        style="background-color:var(--themeColor);color:#fff;"
      >提交</view>
    </van-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: null,
      user_id: "", //用户id
      userInfo: "", //用户信息
      realName: "", //学生真实姓名
      show: false, //显示电话客服
      isLogin: false,
      sysInfo: ""
    };
  },
  onPullDownRefresh() {
    let t = this,
      userInfo = uni.getStorageSync("userInfo"),
      sysInfo = uni.getStorageSync("sysInfo"),
      user_id = uni.getStorageSync("UserId");
    t.user_id = user_id;
    let login = t.$utils.checkLogin();
    if (!login) {
      t.isLogin = false;
      return;
    } else {
      t.isLogin = true;
      t.userInfo = userInfo;
      t.sysInfo = sysInfo;
    }
    uni.stopPullDownRefresh();
  },
  onShow() {
    let t = this;
    t.getDataBase();
  },
  onLoad() {
    let t = this;
    let isLogin = uni.getStorageSync("userInfo");
    t.isAdmin = uni.getStorageSync("isAdmin");
    if (!isLogin) {
      let login = t.$utils.checkLogin();
    } else {
      t.isLogin = true;
      (t.userInfo = uni.getStorageSync("userInfo")),
        (t.sysInfo = uni.getStorageSync("sysInfo")),
        (t.user_id = uni.getStorageSync("userInfo").id);
    }
    console.log(t.user_id);
    t.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let t = this;
      let data = {
        id: t.user_id
      };
      t.$utils.ajax(t.$api.getUserInfo, "get", data, res => {
        console.log(res, "用户数据库信息");
        t.userInfo = Object.assign(t.userInfo, res);
        console.log(t.userInfo), "对象合并";
        uni.setStorageSync("userInfo", t.userInfo);
      });
    },
    /* 修改为真实姓名*/
    toWriteRealName() {
      let t = this;
      t.$utils.checkName(t.realName);
      let data = {
        realName: t.realName,
        user_id: t.user_id
      };
      t.$utils.ajax(t.$api.updateRealName, "post", data, res => {
        console.log(res, "真实姓名是否修改成功");
        if (res.flag == "yes") {
          t.userInfo.nickName = t.realName;
          uni.setStorageSync("userInfo", t.userInfo);
          t.$utils.showToast(res.msg);
        } else {
          t.$utils.showToast(res.msg);
        }
      });
    },
    /* 是否为管理员查询 */
    getDataBase() {
      let t = this,
        isAdmin = uni.getStorageSync("isAdmin");
      console.log(111);
      let data = {
        isAdmin: isAdmin
      };
      t.$utils.ajax(t.$api.isAdminCheck, "get", data, res => {
        console.log(res, "管理员查询");
        uni.setStorageSync("rightContent", res);
      });
    },
   
  }
};
</script>

<style lang="less">
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: var(--contentBgc);
  .iconfont {
    font-size: 50rpx;
    color: var(--themeColor);
    padding: 10rpx;
    padding-top: 20rpx;
  }
  /* 头部区域 */
  .top_header {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    color: #fff;
    padding: 40upx;
    background-color: var(--themeColor);
    /* 详情箭头 */
    .arrows {
      position: absolute;
      top: 100rpx;
      right: 80rpx;
      width: 20rpx;
      height: 20rpx;
      border-top: 4rpx solid #ffffff;
      border-right: 4rpx solid #ffffff;
      transform: rotate(45deg);
    }
    /* 用户头像 */
    .header {
      /* margin: 40rpx 0; */
      width: 154upx;
      height: 154upx;
      border-radius: 50%;
      /* border: 5rpx solid yellow; */
    }
    .name_box {
      /* 用户名 */
      .box_top {
        display: flex;
        flex-direction: row;
        .name {
          font-size: 36upx;
          font-weight: 800;
          padding-left: 30upx;
        }
      }
      /* 用户所在城市 */
      .userCity {
        font-size: 26upx;
        padding-left: 30upx;
      }
    }
  }
  /* 用户操作区域 */
  .header_title {
    margin: 0 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* width: 100%; */
    height: 70rpx;
    line-height: 70rpx;
    padding: 0 20rpx;
    margin-top: 20rpx;
    font-size: 32upx;
    font-weight: 600;
    background-color: #fff;
    border-bottom: 2rpx solid #f6f6f6;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    /* box-sizing: border-box; */
  }
  /* 学生中心 */
  .service {
    margin: 0 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: #fff;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    .service_line {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 30rpx;
      box-sizing: border-box;
      .caption {
        font-size: 26upx;
        color: #6c6c6c;
      }
      button {
        position: static;
        margin: 0;
        padding: 0;
        outline: none;
        border: 1px solid transparent;
        background-color: #fff;
        line-height: 50rpx;
      }
      button::after {
        width: 0 !important;
        height: 0 !important;
      }
    }
  }
  /* 电话客服 */
  .contactWay {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 32upx;
    text-align: center;
    margin: auto 0;
    border: 4rpx solid #f6f6f6;
  }
  .addValue {
    border: 2rpx solid #a2a2a2;
    width: 70%;
    height: 60rpx;
    border-radius: 10rpx;
    text-align: center;
  }
  .sumBtm {
    margin: 0 auto;
    margin-top: 20rpx;
    background-color: var(--themeColor);
    color: #fff;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
  }
}
</style>