// 导入封装MySQL API
const { querySelect, queryInsert, queryUpdate, queryDelete } = require('./db/db.js')
// 导入bcrypt加密算法
const bcrypt = require('bcrypt')
// 引入jwt模块
const jwt = require('jsonwebtoken')
// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('./.env')

// 登录用户函数
function loginUser(username, password, callback) {
  // 判断传入值是否合法 非空校验
  if (username != null && password != null) {
    // 查询数据库账号密码
    querySelect(`select username,password from users where username ='${username}'`, (err, data) => {
      // 判断查询是否出错
      if (err != null) {
        console.log('数据库查询出错:' + err)
        // 返回错误信息
        callback({
          code: 412,
          message: '查询数据库出错'
        })
        return
      }
      // 判断密码是否相同
      if (data.length != 0 && bcrypt.compareSync(password, data[0].password)) {
        // jwt数字签名
        let token = jwt.sign(
          {
            uname: String(data[0].username)
          },
          process.env.SECRET
        )
        callback({
          code: 200,
          message: '登录成功',
          token
        })
        return
      } else if (data.length == 0) {
        callback({
          code: 412,
          message: '用户不存在'
        })
        return
      } else {
        callback({
          code: 412,
          message: '密码出错'
        })
        return
      }
    })
  } else {
    // 返回错误信息 非空校验不通过
    callback({
      code: 412,
      message: '账号密码不为空'
    })
    return
  }
}

// 注册用户函数
function registerUser(username, password, callback) {
  // 判断传入值是否合法 非空校验
  if (username != null && password != null) {
    // 判断用户名是否存在 查询用户名
    querySelect(`select username from users where username = '${username}'`, (err, data) => {
      // 判断查询是否出错
      if (err != null) {
        console.log('数据库查询用户名出错:' + err)
        // 返回错误信息
        callback({
          code: 412,
          message: '查询用户名出错'
        })
        return
      }
      // 根据返回值判断用户名是否存在
      if (data.length == 0) {
        // 用户名不存在 执行注册操作
        queryInsert(`insert into users(uid,username,password) values (null,'${username}','${bcrypt.hashSync(password, 10)}')`, (err, data) => {
          // 判断注册是否出错
          if (err != null) {
            console.log('注册出错:' + err)
            // 返回错误信息
            callback({
              code: 412,
              message: '注册出错'
            })
            return
          }
          // 返回注册成功消息
          callback({
            code: 200,
            message: '注册成功'
          })
          return
        })
      } else {
        // 用户名已存在 返回错误信息
        callback({
          code: 409,
          message: '用户已存在'
        })
        return
      }
    })
  } else {
    // 返回错误信息 非空校验不通过
    callback({
      code: 412,
      message: '账号密码不为空'
    })
    return
  }
}

// 获取用户个人信息函数
function getUserProfile(rawToken, callback) {
  // 解密
  const { uname } = jwt.verify(rawToken, process.env.SECRET)
  // 校验信息有效性
  if (uname) {
    // 查询数据库中用户个人信息
    querySelect(`select username,gender,age from users where username = '${uname}'`, (err, data) => {
      // 判断查询是否出错
      if (err != null) {
        console.log('数据库查询出错:' + err)
        // 返回错误信息
        callback({
          code: 412,
          message: '查询数据库出错'
        })
        return
      }
      // 查询成功返回个人信息
      if (data.length != 0) {
        callback({
          code: 200,
          username: data[0].username,
          gender: data[0].gender,
          age: data[0].age
        })
        return
      } else {
        callback({
          code: 412,
          message: '用户不存在'
        })
        return
      }
    })
  } else {
    callback({
      code: 500,
      message: '身份验证失败'
    })
    return
  }
}

// 导出模块
module.exports = { loginUser, registerUser, getUserProfile }
