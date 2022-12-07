// 导入mysql模块
const mysql = require('mysql')

// 导入数据库连接对象
const { dbConfig } = require('./mysql')

// 定义数据库连接池
// 优点：1.资源重用 2.更快的响应速度 3.避免资源泄露
const connectPool = mysql.createPool(dbConfig)

// 判断连接池的启动状态
if (connectPool) console.log('数据库启动成功，连接池创建成功')

/**
 * @param {String} sql sql查询
 * @param {*} callback 回传
 * @return 数据库查询结果数组
 *
 * 功能描述：数据库查询
 * 日期：2022.09.07
 */
function querySelect(sql, callback) {
  // 连接池建立连接
  connectPool.getConnection(function (error, connection) {
    try {
      // 连接查询
      /**
       *     参数模板
       *     var sql = 'select * from tb limit 100'
       */
      connection.query(sql, function (err, result) {
        try {
          // 消除RowDataPacket方法 https://blog.csdn.net/yihanzhi/article/details/79455790
          // JSON字符串互转即可消除
          if (typeof result != 'undefined') {
            result = JSON.stringify(result)
            result = JSON.parse(result)
          }
          // 回传
          callback(err, result)
          // 释放连接
          connection.release()
        } catch (err) {
          console.log('数据库查询失败')
          console.log(err)
        }
      })
    } catch (error) {
      console.log('连接失败')
      console.log(error)
    }
  })
}

/**
 *
 * @param {String} sql
 * @param {*} callback
 * @return 数据库是否添加成功
 *
 * 功能描述：数据库添加
 * 日期：2022.09.07
 */
function queryInsert(sql, callback) {
  // 连接池建立连接
  connectPool.getConnection(function (error, connection) {
    try {
      // 连接添加
      /**
       *     参数模板
       *     var sql = 'insert into tb(id,title,status,username,date) values(null,'1',1,'admin','2022-11-30')'
       */
      connection.query(sql, function (err, result) {
        try {
          // 消除RowDataPacket方法 https://blog.csdn.net/yihanzhi/article/details/79455790
          // JSON字符串互转即可消除
          if (typeof result != 'undefined') {
            result = JSON.stringify(result)
            result = JSON.parse(result)
          }
          // 回传
          callback(err, result)
          // 释放连接
          connection.release()
        } catch (error) {
          console.log('数据库添加失败')
          console.log(error)
        }
      })
    } catch (error) {
      console.log('连接失败')
      console.log(error)
    }
  })
}

/**
 *
 * @param {String} sql
 * @param {*} callback
 * @return 数据库是否更改成功
 *
 * 功能描述：数据库改变
 * 日期：2022.09.07
 */
function queryUpdate(sql, callback) {
  // 连接池建立连接
  connectPool.getConnection(function (error, connection) {
    try {
      // 连接更改
      /**
       *     参数模板
       *     var sql = "update tb set title='更改的文字内容' where id=1"
       */
      connection.query(sql, function (err, result) {
        try {
          // 消除RowDataPacket方法 https://blog.csdn.net/yihanzhi/article/details/79455790
          // JSON字符串互转即可消除
          if (typeof result != 'undefined') {
            result = JSON.stringify(result)
            result = JSON.parse(result)
          }
          // 回传
          callback(err, result)
          // 释放连接
          connection.release()
        } catch (error) {
          console.log('数据库更改失败')
          console.log(error)
        }
      })
    } catch (error) {
      console.log('连接失败')
      console.log(error)
    }
  })
}

/**
 *
 * @param {String} sql
 * @param {*} callback
 * @return 数据库是删除成功
 *
 * 功能描述：数据库删除
 * 日期：2022.09.07
 */
function queryDelete(sql, callback) {
  // 连接池建立连接
  connectPool.getConnection(function (error, connection) {
    try {
      // 连接更改
      connection.query(sql, function (err, result) {
        try {
          // 消除RowDataPacket方法 https://blog.csdn.net/yihanzhi/article/details/79455790
          // JSON字符串互转即可消除
          if (typeof result != 'undefined') {
            result = JSON.stringify(result)
            result = JSON.parse(result)
          }
          // 回传
          callback(err, result)
          // 释放连接
          connection.release()
        } catch (error) {
          console.log('数据库删除失败')
          console.log(error)
        }
      })
    } catch (error) {
      console.log('连接失败')
      console.log(error)
    }
  })
}

// 导出模块
module.exports = { querySelect, queryInsert, queryUpdate, queryDelete }
