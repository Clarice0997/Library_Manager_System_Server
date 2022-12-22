// 导入封装MySQL API
const { querySelect, queryInsert, queryUpdate, queryDelete } = require('../db/db.js')

// 导入bcrypt加密算法
const bcrypt = require('bcrypt')

// 引入token模块
const { decryptToken, verifyToken } = require('../utils/token')

const { formatDate } = require('../utils/formatDate')

// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('./.env')

/**
 * 获取用户信息函数
 * @param {*} pageNumber 页码
 * @param {*} pageSize 页面条数
 * @param {*} callback 回调函数
 * @returns
 */
function getUsersInfo(pageNumber, pageSize, callback) {
  // 判断是否存在页码
  if (!pageNumber) {
    pageNumber = 1
  }
  // 判断是否存在页面条数限制
  if (!pageSize) {
    pageSize = 10
  }
  querySelect(`select d.* from users u left join users_detail d on u.uid=d.uid where role = 1 limit ${pageNumber - 1},${pageSize}`, (err, data) => {
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
    if (data.length != 0) {
      data.forEach(res => {
        res.create_time = formatDate(new Date(res.create_time), 'yyyy年MM月dd日 hh时mm分')
      })
      callback({
        code: 200,
        data
      })
    } else {
      callback({
        code: 412,
        message: '数据库为空'
      })
    }
  })
}

/**
 * 查询指定用户信息函数
 * @param {*} uid 用户id
 * @param {*} nickname 用户昵称
 * @param {*} pageNumber 页码
 * @param {*} pageSize 页面条数
 * @param {*} callback 回调函数
 */
function searchUser(uid, nickname, pageNumber, pageSize, callback) {
  querySelect(`select d.* from users u left join users_detail d on u.uid = d.uid where role = 1 ${uid && nickname ? `and d.uid = ${uid} and d.nickname like '%${nickname}%'` : uid ? `and d.uid = ${uid}` : `and d.nickname like '%${nickname}%'`} limit ${pageNumber - 1},${pageSize}`, (err, data) => {
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
    if (data.length != 0) {
      data.forEach(res => {
        res.create_time = formatDate(new Date(res.create_time), 'yyyy年MM月dd日 hh时mm分')
      })
      callback({
        code: 200,
        data
      })
    } else {
      callback({
        code: 412,
        message: '不存在该用户'
      })
    }
  })
}

// 导出模块
module.exports = { getUsersInfo, searchUser }
