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
    getJoinCourseList: http + 'getJoinCourseList' //获取已加入课程表
}
export default api