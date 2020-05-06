<template>
  <view class="content">
    <view class="allClass">
      <!-- 我教的课 -->
      <view class="teachClass" :class="isActive==1?'isActive':''" @tap="isActive=1">我教的课</view>
      <!-- 我听的课 -->
      <view class="learnClass" :class="isActive==2?'isActive':''" @tap="isActive=2">我听的课</view>
      <view class="classList" :class="isActive==3?'isActive':''" @tap="isActive=3">课程列表</view>
      <!-- 添加课程按钮 -->
      <view
        class="createClass iconfont icon-tianjia"
        style="color:var(--themeColor);margin-left: auto;"
        @tap="toCreateClass"
      ></view>
    </view>
    <view class="navContent" v-if="isActive==1">
      <view class="box" v-for="(item,index) in courseList" :key="index">
        <view class="courseTitle">{{item.courseName}}</view>
        <view class="createrMegs">
          <span class="className">{{item.className}}</span>
          <span class="createrName">{{item.creater}}</span>
        </view>
      </view>
    </view>
    <view v-else-if="isActive==2" class="navContent">
      <view
        class="box"
        style="background-color:#54b5c9"
        v-for="(item,index) in joinCourseList"
        :key="index"
      >
        <view class="courseTitle">{{item.courseName}}</view>
        <view class="createrMegs">
          <span class="className">{{item.className}}</span>
          <span class="createrName">{{item.creater}}</span>
        </view>
      </view>
    </view>
    <view v-else class="navContent">
      <view
        class="box"
        style="background-color:#00b26a"
        v-for="(item,index) in allCourseList"
        :key="index"
        @tap="getItem(item)"
      >
        <view class="courseTitle">{{item.courseName}}</view>
        <view class="createrMegs">
          <span class="className">{{item.className}}</span>
          <span class="createrName">{{item.creater}}</span>
        </view>
      </view>
    </view>
    <van-popup :show="show" position="bottom" @close="show=false">
      <view class="addCourse" @tap="joinCourse">加入课程</view>
    </van-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      userInfo: "",
      joinCourseList: [],
      allCourseList: [],
      courseList: [],
      isActive: 1,
      show: false,
      item: ""
    };
  },
  /* 触底判断加载下一页 */
  onReachBottom(options) {
    let t = this,
      allCourseList = t.allCourseList;
    if (t.isActive == 3) {
      /* 判断是否加载下一页 */
      if (allCourseList.length < 5) {
        return;
      } else if (allCourseList.length >= 5) {
        t.page++;
        t.getAllCourseList();
      }
    }
  },
  onShow() {
    let t = this;
    t.getCourseList();
    t.allCourseList = [];
    t.getAllCourseList();
    t.getJoinCourseList();
  },

  onLoad() {
    let t = this;
    t.userInfo = uni.getStorageSync("userInfo");
    console.log(t.userInfo, "userInfo");
  },
  methods: {
    getItem(item) {
      let t = this;
      t.show = true;
      t.item = item;
      console.log(item, "item");
    },
    /* 加入课程 */
    joinCourse() {
      let t = this,
        userInfo = t.userInfo,
        item = t.item;
      let data = {
        user_id: userInfo.id,
        creater_id: item.user_id,
        course_id: item.id,
        courseName: item.courseName,
        className: item.className,
        creater: item.creater
      };
      t.$utils.ajax(t.$api.joinCourse, "post", data, res => {
        console.log(res);
        t.show = false;
        t.$utils.showToast(res.msg);
        t.getJoinCourseList();
      });
    },
    /* 获取已加入课程列表 */
    getJoinCourseList() {
      let t = this,
        userInfo = t.userInfo;
      let data = {
        user_id: userInfo.id
      };
      t.$utils.ajax(t.$api.getJoinCourseList, "get", data, res => {
        t.joinCourseList = res;
      });
    },
    /* 获取教课列表 */
    getCourseList() {
      let t = this,
        user_id = uni.getStorageSync("userInfo").id;
      let data = {
        user_id: user_id
      };
      t.$utils.ajax(t.$api.getCourseList, "get", data, res => {
        console.log(res, "教课列表");
        t.courseList = res;
      });
    },
    /* 获取全部课程列表 */
    getAllCourseList() {
      let t = this,
        list = t.allCourseList,
        page = t.page;
      let data = {
        page: page,
        limit: 5
      };
      t.$utils.ajax(t.$api.getCourseList, "get", data, res => {
        /* 数组拼接 */
        list = list.concat(res);
        console.log(list, "全部课程列表");
        if (list.length == 0 && page == 1) {
          console.log(111);
        }
        if (res.length == 0 && page > 1) {
          uni.showToast({
            title: "没有更多了",
            icon: "none",
            duration: 2000,
            success: () => {
              t.page--;
            }
          });
        } else {
        }
        t.allCourseList = list;
      });
    },
    toCreateClass() {
      let t = this;
      uni.navigateTo({
        url: "./createClass"
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
  background-color: var(--contentBgc);
  .allClass {
    margin-bottom: 40rpx;
    display: flex;
    flex-direction: row;
    border-bottom: 2rpx solid #c0c0c0;
    .isActive {
      color: #000;
      font-size: var(--bigTitleSize);
    }
    view {
      margin: auto 0;
      margin-left: 20rpx;
      text-align: center;
      width: 180rpx;
      height: 100rpx;
      line-height: 100rpx;
      color: #c0c0c0;
      font-size: var(--navFontSize);
    }
  }
  .navContent {
    width: 100%;
    box-sizing: border-box;
    .box {
      margin: 0 40rpx 40rpx 40rpx;
      color: #fff;
      border-radius: 10rpx;
      background-color: var(--themeColor);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      .courseTitle {
        font-size: var(--titleSize);
        height: 150rpx;
        line-height: 150rpx;
        text-align: center;
      }
      .createrMegs {
        display: flex;
        justify-content: space-between;
        padding: 0 20rpx;
        font-size: var(--normalFontSize);
        height: 60rpx;
        line-height: 60rpx;
      }
    }
  }
  .addCourse {
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 36rpx;
  }
}
</style>