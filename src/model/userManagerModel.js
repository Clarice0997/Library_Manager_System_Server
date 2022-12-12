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
    console.log(data)
    if (data.length != 0) {
      console.log(formatDate(new Date('2022-12-10T15:52:55.000Z'), 'yyyy年MM月dd日 hh时mm分'))
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

// 导出模块
module.exports = { getUsersInfo }
