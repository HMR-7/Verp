<template>
  <view class="content">
    <view class="navContent">
      <view class="box" v-for="(item,index) in workList" :key="index" @tap="toShow(item.work_id)">
        <view class="courseTitle">{{item.answer}}</view>
        <view class="createrMegs">
          <span class="className">{{item.studentName}}</span>
          <span class="createrName" v-if="!item.grade">状态：未评分</span>
          <span class="createrName" v-if="item.grade">分数：{{item.grade}}</span>
        </view>
      </view>
    </view>
    <van-popup
      :show="show"
      position="center"
      @close="show=false"
      custom-style="padding:20rpx;border-radius: 20rpx;"
    >
      <input type="number" placeholder="请输入分数" v-model="grade" />
      <view class="confirm" @tap="confirm(course_id,work_id)">提交</view>
    </van-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      workList: "", //作业列表
      course_id: "",
      work_id: "", //作业id
      grade: "" //成绩
    };
  },
  onLoad(options) {
    let t = this;
    t.course_id = options.course_id;
    t.getNoGradeWorkList();
  },
  methods: {
    toShow(work_id) {
      let t = this;
      t.show = true;
      t.work_id = work_id;
    },
    getNoGradeWorkList() {
      let t = this;
      let data = {
        course_id: t.course_id
      };
      t.$utils.ajax(t.$api.gradeWorkList, "get", data, res => {
        console.log(res, "");
        t.workList = res;
      });
    },
    confirm(course_id, work_id) {
      let t = this;
      let data = {
        grade: t.grade,
        course_id: course_id,
        work_id: work_id
      };
      t.$utils.ajax(t.$api.toUpdateGrade, "post", data, res => {
        t.$utils.showToast(res.msg);
        if (res.flag == "yes") {
          t.show = false;
          t.getNoGradeWorkList();
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
  .navContent {
    margin-top: 20rpx;
    width: 100%;
    box-sizing: border-box;
    .box {
      margin: 0 40rpx 40rpx 40rpx;
      color: #fff;
      border-radius: 10rpx;
      background-color: var(--priceColor);
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