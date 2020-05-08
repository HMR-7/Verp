/* 本地地址 */
const http = 'http://127.0.0.1:3000/'
const api = {
    getOpenid: http + 'getOpenid', //获取openid
    userInfo: http + 'userInfo', //用户登录
    insertuserInfo: http + 'insertuserInfo', //用户注册
    updateRealName: http + 'updateRealName', //修改真实姓名
    getUserInfo: http + 'getUserInfo', //获取数据库用户信息
    createClass: http + 'createClass', //创建课程
    getCourseList: http + 'getCourseList', //获取'我教的课'列表
    joinCourse: http + 'joinCourse', //加入现有课程
    getJoinCourseList: http + 'getJoinCourseList', //获取已加入课程表
    getJoinCourseNum: http + 'getJoinCourseNum', //获取加入课程人
    toDelectStudent: http + 'toDelectStudent', //删除学生信息
    toAddWorkMegs: http + 'toAddWorkMegs', //添加作业信息
    getWorkList: http + 'getWorkList', //获取待发布作业列表
    toShowWork: http + 'toShowWork', //发布作业
    toAddQuestions: http + 'toAddQuestions', //添加随机问题
    getQuesList: http + 'getQuesList', //获取随机列表问题
    toAddDiscuss: http + 'toAddDiscuss', //添加讨论话题
    getDiscussList: http + 'getDiscussList', //获取话题列表
    toShowDis: http + 'toShowDis', //发布话题
    addDiscussMegs: http + 'addDiscussMegs', //发布话题评论
    getAllDiscussList: http + 'getAllDiscussList', //获取评论列表
    addWorkAnswer: http + 'addWorkAnswer', //学生提交作业
    getStudentAnswer: http + 'getStudentAnswer', //学生查看自己的作业内容
    addQuesAnswer: http + 'addQuesAnswer', //学生回答随机问题答案
    getStuQuesAnswer: http + 'getStuQuesAnswer', //学生查看是否已经回答随机问题
    gradeWorkList: http + 'gradeWorkList', //获取分数列表
    toUpdateGrade: http + 'toUpdateGrade' //创建者进行打分

}
export default api