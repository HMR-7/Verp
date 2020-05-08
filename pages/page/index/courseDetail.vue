<template>
  <view class="content">
    <!-- 课程名称 -->
    <view class="courseName">
      {{courseDetail.courseName}}
      <view v-if="isAdmin" class="woroGrade" @tap="toGrade(course_id,creater_id)">作业批改</view>
    </view>
    <!-- 功能模块 -->
    <view class="navModule">
      <view @tap="getTitle(1)" v-if="isAdmin==1">
        <view class="iconfont icon-chengyuanguanli"></view>
        <view class="title">成员管理</view>
      </view>
      <view @tap="getTitle(2)">
        <view class="iconfont icon-taolun"></view>
        <view class="title">讨论区</view>
      </view>
      <view @tap="getTitle(3)">
        <view class="iconfont icon-zuoyepigai"></view>
        <view class="title">作业区</view>
      </view>
      <view @tap="getTitle(4)">
        <view class="iconfont icon-tiwen"></view>
        <view class="title">提问区</view>
      </view>
    </view>
    <!-- 预设作业列表 -->
    <view class="navContent">
      <view v-if="isActive==1 && isAdmin==1">
        <view class="navContentTitle">成员管理</view>
        <view class="studentList" v-for="(item,index) in JoinCourseNum" :key="index">
          <view>
            <text style="color:#007aff;font-weight: bolder;">班级：</text>
            <span>{{item.className}}</span>
          </view>
          <view>
            <text style="color:#007aff;font-weight: bolder;">手机号：</text>
            <span>{{item.user_phone}}</span>
          </view>
          <view>
            <span class="delBtn" @tap="toDelect(item.user_id)">删除</span>
          </view>
        </view>
      </view>
      <view v-else-if="isActive==2">
        <view v-if="isAdmin" class="addWork" @tap="showDiscuss=true">添加话题</view>
        <view v-if="isAdmin" class="navContentTitle">待发布话题列表</view>
        <view v-if="isAdmin">
          <scroll-view scroll-y="true" style="max-height:400rpx;padding-top: 20rpx">
            <view v-for="(item,index) in getDiscussList" :key="index">
              <view class="studentList">
                <text style="color:#007aff;font-weight: bolder;">话题:</text>
                <span>{{item.title}}</span>
                <text style="color:#007aff;font-weight: bolder;">状态:</text>
                <span
                  v-text="item.isShow?'已发布':'待发布'"
                  class="showBtn"
                  @tap="toShowDis(item.id,item.isShow)"
                ></span>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="navContentTitle">已发布话题列表</view>
        <view>
          <scroll-view scroll-y="true" style="max-height:400rpx;padding-top: 20rpx">
            <view v-for="(item,index) in getDiscussList" :key="index">
              <view class="studentList" v-if="item.isShow">
                <text style="color:#007aff;font-weight: bolder;">话题:</text>
                <span>{{item.title}}</span>
                <span class="checkBtn" @tap="toDiscuss(item.id,item.course_id,item.title)">参与讨论</span>
              </view>
            </view>
          </scroll-view>
        </view>
        <van-popup
          :show="showDiscuss"
          position="center"
          @close="showDiscuss=false"
          custom-style="padding:20rpx"
        >
          <textarea
            v-model="discussTitle"
            maxlength="-1"
            placeholder="请输入话题标题"
            style="background-color: var(--contentBgc);"
          ></textarea>
          <view class="comfirm" @tap="discussComfirm">完成</view>
        </van-popup>
      </view>
      <view v-else-if="isActive==3">
        <view
          v-if="isAdmin"
          class="addWork"
          @tap="toAddWork(courseDetail.creater,course_id,creater_id)"
        >添加作业</view>
        <view v-if="isAdmin" class="navContentTitle">待发布作业列表</view>
        <view v-if="isAdmin">
          <scroll-view scroll-y="true" style="max-height:400rpx;padding-top: 20rpx">
            <view v-for="(item,index) in workList" :key="index">
              <view class="studentList">
                <text style="color:#007aff;font-weight: bolder;">作业:</text>
                <span>{{item.workTitle}}</span>
                <text style="color:#007aff;font-weight: bolder;">发布人:</text>
                <span>{{item.creater}}</span>
                <text style="color:#007aff;font-weight: bolder;">状态:</text>
                <span
                  v-text="item.isShow?'已发布':'待发布'"
                  class="showBtn"
                  @tap="toShowWork(item.id,item.isShow)"
                ></span>
                <span class="checkBtn" @tap="toLookMegs(item.workMegs)">详情</span>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="navContentTitle">已发布作业列表</view>
        <view>
          <scroll-view scroll-y="true" style="max-height:400rpx;padding-top: 20rpx">
            <view v-for="(item,index) in workList" :key="index">
              <view class="studentList" v-if="item.isShow">
                <text style="color:#007aff;font-weight: bolder;">作业:</text>
                <span>{{item.workTitle}}</span>
                <text style="color:#007aff;font-weight: bolder;">发布人:</text>
                <span>{{item.creater}}</span>
                <span
                  class="checkBtn"
                  @tap="toCheckMegs({work_id:item.id},{workMegs:item.workMegs},{course_id:item.course_id},{workTitle:item.workTitle})"
                >详情</span>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view v-else>
        <view v-if="isAdmin" class="addWork" @tap="showQuestion=true">添加随机问题</view>
        <view class="navContentTitle">随机问题列表</view>
        <view
          class="quesBox"
          v-for="(item,index) in getQuesList"
          :key="index"
          @tap="toAnswer(item.answer_user_id,item)"
        >
          <scroll-view scroll-y="true" style="max-height:200rpx;text-align: center;">
            <text style="color:red;font-size: 40rpx;">问题：</text>
            {{item.questionMegs}}
          </scroll-view>
          <view style="margin-top: 40rpx;text-align: center;">
            <text style="color:#00b26a;font-size: 36rpx;">回答人：</text>
            {{item.answer_student_name}}
          </view>
        </view>
      </view>
      <van-popup
        :show="showQuestion"
        position="center"
        @close="showQuestion=false"
        custom-style="padding:20rpx"
      >
        <textarea
          v-model="question"
          maxlength="-1"
          placeholder="请输入随机内容"
          style="background-color: var(--contentBgc);"
        ></textarea>
        <view class="comfirm" @tap="comfirm">完成</view>
      </van-popup>
    </view>
    <van-popup :show="show" position="center" @close="show=false" custom-style="padding:20rpx">
      <span>{{workMegs}}</span>
    </van-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showDiscuss: false,
      showQuestion: false,
      show: false,
      isAdmin: 0,
      question: "", //随机问题信息
      discussTitle: "", //话题标题
      answerQue: "",
      userInfo: "", //用户信息
      isActive: 1,
      course_id: "", //查询课程id
      creater_id: "", //课程创建者id
      courseDetail: "", //课程详情
      JoinCourseNum: "", //加入课程人数信息
      workList: "", //待发布作业列表
      nowWorkList: "", //已发布作业列表
      workMegs: "", //显示作业信息
      getQuesList: "", //随机问题列表
      StudentMegs: "", //随机提问人信息
      getDiscussList: "" // 获取讨论话题列表
    };
  },
  onShow() {
    let t = this;
    if (t.isAdmin == 1) {
      t.getTitle(1);
    } else {
      t.getTitle(2);
    }
    t.getCourseDetail();
    t.getWorkList();
    t.getQues();
    t.getDisList();
  },
  onLoad(options) {
    console.log(options);
    let t = this;
    t.userInfo = uni.getStorageSync("userInfo");
    let userInfo = t.userInfo;
    t.creater_id = options.user_id;
    t.course_id = options.id;
    if (userInfo.id == t.creater_id) {
      t.isAdmin = 1;
    }
    t.getCourseDetail();
    t.getWorkList();
    t.getQues();
    t.getDisList();
  },
  methods: {
    toLookMegs(workMegs) {
      let t = this;
      t.show = true;
      t.workMegs = workMegs;
    },
    toCheckMegs(...obj) {
      let t = this;
      console.log(obj, "obj");
      let a = {};
      obj.forEach((v, i, arr) => {
        a = Object.assign(a, arr[i]);
      });
      uni.navigateTo({
        url: `./answerWork?obj=${JSON.stringify(a)}`
      });
    },
    toShowWork(id, isShow) {
      let t = this;
      if (isShow) {
        t.$utils.showToast("作业已发布");
        return;
      }
      let data = {
        id: id
      };
      t.$utils.ajax(t.$api.toShowWork, "post", data, res => {
        t.$utils.showToast(res.msg);
        t.getWorkList();
      });
    },
    toShowDis(id, isShow) {
      let t = this;
      console.log(id, "id");
      console.log(isShow, "isShow");
      if (isShow) {
        t.$utils.showToast("作业已发布");
        return;
      }
      let data = {
        id: id
      };
      t.$utils.ajax(t.$api.toShowDis, "post", data, res => {
        t.$utils.showToast(res.msg);
        console.log(1111);
        t.getDisList();
      });
    },

    getWorkList() {
      let t = this;
      let data = {
        course_id: t.course_id
      };
      t.$utils.ajax(t.$api.getWorkList, "get", data, res => {
        console.log(res, "1111");
        t.workList = res;
      });
    },
    getNewWorkList() {
      let t = this;
      let data = {
        isShow: 1,
        course_id: t.course_id
      };
      t.$utils.ajax(t.$api.getWorkList, "get", data, res => {
        console.log(res, "1111");
        t.nowWorkList = res;
      });
    },
    getTitle(isActive) {
      let t = this;
      isActive == 1
        ? (t.isActive = 1)
        : isActive == 2
        ? (t.isActive = 2)
        : isActive == 3
        ? (t.isActive = 3)
        : (t.isActive = 4);
      if (isActive == 1) {
        let data = {
          id: t.course_id
        };
        t.$utils.ajax(t.$api.getJoinCourseNum, "get", data, res => {
          console.log(res, "听课成员");
          t.JoinCourseNum = res;
        });
      }
    },
    getCourseDetail() {
      let t = this;
      let data = {
        id: t.course_id
      };
      t.$utils.ajax(t.$api.getCourseList, "get", data, res => {
        console.log(res, "课程详情");
        t.courseDetail = res;
      });
    },
    getQues() {
      let t = this;
      let data = {
        course_id: t.course_id
      };
      t.$utils.ajax(t.$api.getQuesList, "get", data, res => {
        t.getQuesList = res;
        console.log(res, "随机问题列表");
      });
    },
    comfirm() {
      let t = this,
        JoinCourseNum = t.JoinCourseNum;
      if (!t.question) {
        t.$utils.showToast("请输入随机问题信息");
        return;
      }
      let length = JoinCourseNum.length;
      let Number = Math.floor(Math.random() * length);
      let StudentMegs = JoinCourseNum[Number];
      t.StudentMegs = StudentMegs;
      console.log(StudentMegs, "随机提问人员信息");

      let data = {
        course_id: t.course_id,
        user_id: StudentMegs.user_id,
        questionMegs: t.question,
        studentName: StudentMegs.studentName
      };
      t.$utils.ajax(t.$api.toAddQuestions, "post", data, res => {
        t.$utils.showToast(res.msg);
        t.getQues();
      });
    },
    discussComfirm() {
      let t = this;
      let data = {
        isActive: 2,
        course_id: t.course_id,
        creater_id: t.creater_id,
        title: t.discussTitle
      };
      t.$utils.ajax(t.$api.toAddDiscuss, "post", data, res => {
        t.$utils.showToast(res.msg);
        if (res.flag == "yes") {
          t.showDiscuss = false;
        }
        t.getDisList();
      });
    },
    getDisList() {
      let t = this;
      let data = {
        course_id: t.course_id
      };
      t.$utils.ajax(t.$api.getDiscussList, "get", data, res => {
        console.log(res, "讨论区话题列表");
        t.getDiscussList = res;
      });
    },

    toAnswer(id, StudentMegs) {
      let t = this;
      if (t.userInfo.id != id) {
        t.$utils.showToast("您暂无权回答此问题");
      } else {
        console.log("我来回答");
        uni.navigateTo({
          url: "./answerQuestion?studentMegs=" + JSON.stringify(StudentMegs)
        });
      }
    },
    toDiscuss(id, courseid, title) {
      let t = this,
        arr = t.JoinCourseNum;
      let a = arr.some(v => {
        if (v.user_id == t.userInfo.id) {
          return true;
        }
      });
      if (!a) {
        console.log("欢迎参加讨论！");
        uni.navigateTo({
          url:
            "./answerDiscuss?discuss_id=" +
            id +
            "&&course_id=" +
            courseid +
            "&&title=" +
            title
        });
      } else {
        t.$utils.showToast("您暂无权参与此话题");
      }
    },
    toDelect(user_id) {
      let t = this;
      console.log(user_id);
      let data = {
        student_id: user_id
      };
      t.$utils.ajax(t.$api.toDelectStudent, "get", data, res => {
        t.$utils.showToast(res.msg);
        t.getTitle(1);
      });
    },
    toAddWork(creater, course_id, creater_id) {
      let t = this;
      console.log(creater_id);
      uni.navigateTo({
        url:
          "./createWork?creater=" +
          creater +
          "&&course_id=" +
          course_id +
          "&&creater_id=" +
          creater_id
      });
    },
    toGrade(course_id, creater_id) {
      let t = this;
      uni.navigateTo({
        url: "./grade?course_id=" + course_id
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
  .iconfont {
    font-size: 60rpx;
    text-align: center;
  }
  .courseName {
    padding: 40rpx 0 0 40rpx;
    font-size: 48rpx;
    height: 160rpx;
    .woroGrade {
      position: fixed;
      top: 40rpx;
      right: 20rpx;
      padding: 20rpx;
      background-color: var(--themeColor);
      border-radius: 20rpx;
      font-size: 20rpx;
      color: #fff;
    }
  }
  .navModule {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .title {
    margin-top: 10rpx;
    font-size: var(--navFontSize);
  }
  .navContent {
    margin-top: 20rpx;
    border-top: 4rpx solid #f0ad4e;

    .navContentTitle {
      color: var(--themeColor);
      height: 80rpx;
      line-height: 80rpx;
      font-size: 40rpx;
      padding-left: 20rpx;
    }
    .studentList {
      padding-bottom: 20rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      border-bottom: 2rpx solid #ededed;
      .delBtn {
        background-color: red;
        padding: 5rpx 10rpx;
        border-radius: 10rpx;
        color: #fff;
      }
      .showBtn {
        background-color: #00b26a;
        padding: 5rpx 10rpx;
        border-radius: 10rpx;
        color: #fff;
      }
      .checkBtn {
        background-color: #4cd964;
        padding: 5rpx 10rpx;
        border-radius: 10rpx;
        color: #fff;
      }
    }
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
    .quesBox {
      margin: 0 20rpx;
      margin-top: 40rpx;
      padding: 20rpx 0;
      background: #fc914c;
      border-radius: 20rpx;
    }
  }
}
</style>