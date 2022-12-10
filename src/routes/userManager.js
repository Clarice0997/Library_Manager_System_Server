// 导入express
const express = require('express')

// 实例化Router
const router = express.Router()

// 导入自定义校验中间件
const auth = require('../utils/auth')

// import
const { getUsersInfo } = require('../model/userManagerModel')

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
  getUsersInfo(pageNumber, pageSize, result => {
    console.log(result)
    res.status(result.code).send({
      result
    })
  })
})

module.exports = router
