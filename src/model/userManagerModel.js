// 导入封装MySQL API
const { querySelect, queryInsert, queryUpdate, queryDelete } = require('../db/db.js')

// 导入bcrypt加密算法
const bcrypt = require('bcrypt')

// 引入token模块
const { decryptToken, verifyToken } = require('../utils/token')

// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('./.env')

// 获取用户信息函数
function getUsersInfo() {}

// 导出模块
module.exports = { getUsersInfo }
