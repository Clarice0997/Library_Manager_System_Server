// 导入express
const express = require('express')

// 实例化Router
const router = express.Router()

// 导入自定义校验中间件
const auth = require('../utils/auth')

// import
const { getUsersInfo, searchUser } = require('../model/userManagerModel')

/**
 * @api {get} /apis/userManager/getInfo 获取用户信息
 * @apiDescription 获取用户信息
 * @apiName getInfo
 * @apiGroup userManager
 * @apiParam {string} pageNumber 页码
 * @apiParam {string} pageSize 页面条数
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "result": {
 *          "code": 200,
 *          "data": data
 *      }
 *  }
 * @apiVersion 0.1.0
 */
router.get('/getInfo', auth, async (req, res) => {
  // 解构赋值查询字段
  let { pageNumber, pageSize } = req.query
  // 执行获取用户信息函数
  try {
    getUsersInfo(pageNumber, pageSize, result => {
      res.status(result.code).send({
        result
      })
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      code: 500,
      message: '请求错误'
    })
  }
})

// 搜索用户信息
router.get('/searchUser', auth, async (req, res) => {
  // 解构赋值查询字段
  let { uid, nickname, pageNumber, pageSize } = req.query
  // 执行获取用户信息函数
  try {
    if (uid || nickname) {
      searchUser(uid, nickname, pageNumber, pageSize, result => {
        res.status(200).send({
          result
        })
      })
    } else {
      getUsersInfo(pageNumber, pageSize, result => {
        res.status(result.code).send({
          result
        })
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      code: 500,
      message: '请求错误'
    })
  }
})

module.exports = router
