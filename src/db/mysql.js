// 定义数据库连接对象
var dbConfig = {}

// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('../../.env')

// 为数据库连接对象赋值
dbConfig = {
  host: process.env.HOST,
  port: Number(process.env.SQL_PORT),
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

// 导出模块
module.exports = { dbConfig }
