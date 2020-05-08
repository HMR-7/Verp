const express = require("express");
const mysql = require("mysql");
const request = require("request")
var app = express();
var conn = mysql.createConnection({
    multipleStatements: true
});
/* 连接本地数据库 */
var conn = mysql.createConnection({
    host: "120.55.93.29",
    port: "3306",
    user: "hmr",
    password: "101216",
    database: "verp",
    charset: 'UTF8Mb4_GENERAL_CI'
});
/* 连接本地数据库 */
/* var conn = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "123456",
    database: "verp",
    charset: 'UTF8Mb4_GENERAL_CI'
}); */
//2.发送请求(查询)
/* 获取数据库用户信息 */
app.get('/getUserInfo', function (req, res) {
    let reData = req.query;
    const sql = "SELECT * FROM userinfo where id = '" + reData.id + "'"
    conn.query(sql, function (ree, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(...data);
    })

})
/* 获取openid */
app.get("/getOpenid", function (req, res) {
    let reData = req.query;
    console.log(reData, '获取openid时前端接受的code码');
    var code = reData.js_code;
    var APP_URL = 'https://api.weixin.qq.com/sns/jscode2session'
    var APP_ID = 'wxdc201c1fb76c8d0b' //小程序的app id ，在公众开发者后台可以看到
    var APP_SECRET = 'f7d2f0bf258c646733921136135f86a4' //小程序的app secrect，在公众开发者后台可以看到

    if (!!code) {
        request(`${APP_URL}?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`, (error, response, body) => {
            //console.log('statusCode:', response && response.statusCode)
            console.log(body)
            res.end(body)
        })
    }
})
/* 查询用户是否已经注册完毕， */
app.get("/userInfo", function (req, res) {
    let Sqldata = req.query;
    console.log(req.query, '用户登录get请求前端传递到后端的参数')
    const sql = "SELECT openid,id,isAdmin FROM userinfo where openid = '" + Sqldata.openid + "'"
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        if (data.length == 0) {
            res.send({
                msg: false
            })
        } else {
            res.send(...data);

        }
    })
});
/* 用户注册插入表 */
app.post('/insertuserInfo', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        if (!data.openid) {
            res.send('无openid，禁止登录')
            return
        }
        console.log(data, '用户注册post请求接受前端传递的参数');
        const insertsql = 'insert into userinfo(nickName,userPhone,openid) values(?,?,?)';
        conn.query(insertsql, [data.userName, data.userPhone, data.openid], function (err) {
            if (err) {
                console.log(err);

                res.send({
                    msg: "注册失败!!",
                    flag: 'no'
                });
            } else {
                const sql = "SELECT id FROM userinfo where openid = '" + data.openid + "'"
                conn.query(sql, function (err, result) {
                    let _res = JSON.stringify(result)
                    let data = JSON.parse(_res)
                    res.send(data);
                })

            }
        })
        return
    })
})
/* 学生登陆成功后修改真实姓名 */
app.post('/updateRealName', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, '用户修改真实姓名post请求接受前端传递的参数');
        const sql = "UPDATE userinfo SET nickName ='" + data.realName + "' where id=" + data.user_id
        conn.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "姓名修改失败",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "姓名修改成功",
                    flag: 'yes'
                });
            }
        })

    })
})
/* 创建课程 */
app.post('/createClass', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        const selSql = "select courseName from course where user_id=" + data.user_id;
        conn.query(selSql, function (err, result) {
            let _res = JSON.stringify(result)
            let _data = JSON.parse(_res)
            let a = _data.some(value => {
                if (value.courseName == data.courseName) {
                    console.log(111);
                    return true;
                }
            })
            if (a) {
                console.log('课程已经存在');
                res.send({
                    msg: "课程已经存在!!",
                    flag: 'had'
                });
                return;
            }
            if (!a) {
                const sql = 'insert into course(user_id,courseName,className,creater) values(?,?,?,?)';
                conn.query(sql, [data.user_id, data.courseName, data.className, data.creater], function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            msg: "创建失败!!",
                            flag: 'no'
                        });
                    } else {
                        res.send({
                            msg: "创建成功!!",
                            flag: 'yes'
                        });
                    }
                })
            }
        })

    })


})
/* 获取教课列表 */
app.get('/getCourseList', function (req, res) {
    let reData = req.query;
    if (reData.user_id && !reData.limit) {
        const sql = "SELECT * FROM course where user_id = '" + reData.user_id + "'"
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res);
            res.send(data);
        })
    }
    if (reData.limit) {
        console.log(reData.limit, 'reData.limitreData.limit');
        let limit = Number(reData.page - 1) * Number(reData.limit);
        const sql = "SELECT * FROM course where user_id != '" + reData.user_id + "'" + " limit " + limit + "," + reData.limit

        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res);
            res.send(data);
        })
    }
    if (reData.id) {
        const sql = "SELECT * FROM course where id = " + reData.id
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res);
            res.send(...data);
        })
    }

})
/* 加入课程 */
app.post('/joinCourse', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        const sql = "select * from listen where user_id = " + data.user_id
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let _data = JSON.parse(_res)
            console.log(data, 'data');

            let a = _data.some(v => {
                if (v.course_id == data.course_id) {
                    return true;
                }
            })
            if (a) {
                console.log('已经加入课程');
                res.send({
                    msg: "已加入课程!!",
                    flag: 'had'
                });
                return;
            } else {
                console.log(data, '课程加入传递的参数');
                const sql = "insert into  listen (user_id,creater_id,course_id,courseName,className,isJoin,creater,studentName,user_phone) values (" + data.user_id + "," + data.creater_id + "," + data.course_id + ",'" + data.courseName + "','" + data.className + "'," + 1 + ",'" + data.creater + "','" + data.studentName + "','" + data.user_phone + "')"
                conn.query(sql, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            msg: "加入失败!!",
                            flag: 'no'
                        });
                    } else {
                        res.send({
                            msg: "加入成功!!",
                            flag: 'yes'
                        });
                    }
                })
            }
        })

    })
})
app.get('/getJoinCourseList', function (req, res) {
    let reData = req.query;
    if (reData.user_id) {
        const sql = "SELECT * FROM listen where user_id = '" + reData.user_id + "'"
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res);
            res.send(data)
        })
    }
})
app.get('/getJoinCourseNum', function (req, res) {
    let reData = req.query;
    const sql = "SELECT * FROM listen where course_id = " + reData.id
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(data);
    })
})
app.get('/toDelectStudent', function (req, res) {
    let reData = req.query;
    const sql = "delete from listen where user_id= " + reData.student_id
    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.send({
                msg: "删除失败!!",
                flag: 'no'
            });
        } else {
            res.send({
                msg: "删除成功!!",
                flag: 'yes'
            });
        }
    })
})
app.post('/toAddWorkMegs', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, data);
        const sql = "insert into  work (workMegs,workTitle,creater,course_id,creater_id) values ('" + data.workMegs + "','" + data.workTitle + "','" + data.creater + "','" + data.course_id + "','" + data.creater_id + "')"
        conn.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "添加失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "添加成功!!",
                    flag: 'yes'
                });
            }
        })
    })
})
app.get('/getWorkList', function (req, res) {
    let reData = req.query;
    const sql = "select * from work where course_id= " + reData.course_id
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(data);
    })
})
app.post('/toShowWork', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        const sql = "update work SET isShow = '1' WHERE id=" + data.id
        conn.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "发布失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "发布成功!!",
                    flag: 'yes'
                });
            }
        })

    })
})
app.post('/toAddQuestions', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        const sql = 'insert into question(questionMegs,answer_user_id,answer_student_name,course_id) values(?,?,?,?)';
        conn.query(sql, [data.questionMegs, data.user_id, data.studentName, data.course_id], function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "发布失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "发布成功!!",
                    flag: 'yes'
                });
            }
        })

    })
})
app.get('/getQuesList', function (req, res) {
    let reData = req.query;
    const sql = "select * from question where course_id= " + reData.course_id
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(data);
    })
})
app.post('/toAddDiscuss', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        const sql = 'insert into discuss(course_id,creater_id,title) values(?,?,?)';
        conn.query(sql, [data.course_id, data.creater_id, data.title], function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "发布失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "发布成功!!",
                    flag: 'yes'
                });
            }
        })

    })
})
app.get('/getDiscussList', function (req, res) {
    let reData = req.query;
    const sql = "select * from discuss where course_id= " + reData.course_id
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(data);
    })
})
app.post('/toShowDis', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data);

        const sql = "update discuss SET isShow = '1' WHERE id=" + data.id

        conn.query(sql, function (err, result) {
            console.log(result, 'result');

            if (err) {
                console.log(err);
                res.send({
                    msg: "发布失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "发布成功!!",
                    flag: 'yes'
                });
            }
        })

    })
})
app.post('/addDiscussMegs', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data);
        let nowtime = new Date().getTime();
        const sql = 'insert into answerDiscuss(nickName,userImg,userMegs,course_id,discuss_id,time) values(?,?,?,?,?,?)';
        conn.query(sql, [data.nickName, data.userImg, data.userMegs, data.course_id, data.discuss_id, nowtime], function (err, result) {
            console.log(result, 'result');

            if (err) {
                console.log(err);
                res.send({
                    msg: "评论失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "评论成功!!",
                    flag: 'yes'
                });
            }
        })

    })
})
app.get('/getAllDiscussList', function (req, res) {
    let reData = req.query;
    const sql = "select * from answerDiscuss where discuss_id= " + reData.discuss_id
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(data);
    })
})
app.post('/addWorkAnswer', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data);
        let nowtime = new Date().getTime();
        const sql = 'insert into answerWork(work_id,course_id,student_id,answer,studentName) values(?,?,?,?,?)';
        conn.query(sql, [data.work_id, data.course_id, data.student_id, data.answer, data.studentName], function (err, result) {
            console.log(result, 'result');

            if (err) {
                console.log(err);
                res.send({
                    msg: "作业提交失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "作业提交成功!!",
                    flag: 'yes'
                });
            }
        })

    })
})
app.get('/getStudentAnswer', function (req, res) {
    let reData = req.query;
    const sql = "select * from answerWork where student_id= " + reData.student_id + " and work_id= " + reData.work_id
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(...data);
    })
})
app.post('/addQuesAnswer', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data);
        let nowtime = new Date().getTime();
        const sql = 'insert into answerQuestion(student_id,question_id,answer,course_id) values(?,?,?,?)';
        conn.query(sql, [data.student_id, data.question_id, data.answer, data.course_id], function (err, result) {
            console.log(result, 'result');

            if (err) {
                console.log(err);
                res.send({
                    msg: "作业提交失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "作业提交成功!!",
                    flag: 'yes'
                });
            }
        })

    })
})
app.get('/getStuQuesAnswer', function (req, res) {
    let reData = req.query;
    console.log(reData, 'reDatareData');
    const sql = "select * from answerQuestion where student_id=" + reData.student_id + " and question_id=" + reData.question_id
    console.log(sql, 'sql');

    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(...data);
    })
})
app.get('/gradeWorkList', function (req, res) {
    let reData = req.query;
    console.log(reData, 'reDatareData');
    const sql = "select * from answerWork where course_id=" + reData.course_id
    console.log(sql, 'sql');

    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res);
        res.send(data);
    })
})
app.post('/toUpdateGrade', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        const sql = "update answerWork set grade = " + data.grade + " where course_id =" + data.course_id + " and work_id =" + data.work_id
        conn.query(sql, function (err) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "评定失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "评定成功!!",
                    flag: 'yes'
                });
            }
        })
        return
    })

})
app.listen(3000, () => {
    console.log('服务已启动');

});