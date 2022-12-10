// 导入封装MySQL API
const { querySelect, queryInsert, queryUpdate, queryDelete } = require('../db/db.js')

// 导入bcrypt加密算法
const bcrypt = require('bcrypt')

// 引入token模块
const { setToken, decryptToken } = require('../utils/token')

// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('./.env')

/**
 * 登录用户函数
 * @param {*} username 账号
 * @param {*} password 密码
 * @param {*} callback 回调函数
 * @returns
 */
function loginUser(username, password, callback) {
  // 判断传入值是否合法 非空校验
  if (username != null && password != null) {
    // 查询数据库账号密码
    querySelect(`select uid,username,password from users where username ='${username}'`, (err, data) => {
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
        let token = setToken(data[0].uid, String(data[0].username))
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

/**
 * 注册用户函数
 * @param {*} username 账号
 * @param {*} password 密码
 * @param {*} nickname 昵称
 * @param {*} callback 回调函数
 * @returns
 */
function registerUser(username, password, nickname, callback) {
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
        querySelect(`select nickname from users_detail where nickname = '${nickname}'`, (err, data) => {
          // 判断查询是否出错
          if (err != null) {
            console.log('数据库查询昵称出错:' + err)
            // 返回错误信息
            callback({
              code: 412,
              message: '查询昵称出错'
            })
            return
          }
          if (data.length != 0) {
            // 返回错误信息
            callback({
              code: 412,
              message: '昵称已被注册'
            })
            return
          }
          // 用户名不存在 执行注册操作
          queryInsert(`insert into users(uid,username,password) values (null,'${username}','${bcrypt.hashSync(password, 10)}')`, async (err, data) => {
            // 判断注册是否出错
            if (err != null) {
              console.log('注册出错:' + err)
              // 返回错误信息
              callback({
                code: 412,
                message: '注册出错：插入用户出错'
              })
              return
            }
            // 向用户详细页插入昵称
            await queryUpdate(`update users_detail set nickname = '${nickname}' where uid = ${data.insertId}`, (err, data) => {
              // 判断插入昵称是否出错
              if (err != null) {
                console.log('注册出错:' + err)
                // 返回错误信息
                callback({
                  code: 412,
                  message: '注册出错：' + err
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
          })
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
  const { uid, uname } = decryptToken(rawToken)
  // 校验信息有效性
  if (uname && uid) {
    // 查询数据库中用户个人信息
    querySelect(`select * from users where uid = '${uid}'`, (err, data) => {
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
          data
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
