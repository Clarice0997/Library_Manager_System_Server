// 导入express
const express = require('express')

// 实例化Router
const router = express.Router()

// 引入封装登录注册模块
const { loginUser, registerUser, getUserProfile } = require('../model/userModel')

// 导入自定义校验中间件
const auth = require('../utils/auth')

/**
 * @api {post} /apis/user/login 用户登录
 * @apiDescription 用户登录
 * @apiName login
 * @apiGroup auth
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "data": {
 *          "code": 200,
 *          "message": "登录成功"
 *      },
 *      "token": token
 *  }
 * @apiVersion 0.1.0
 */
router.post('/login', async (req, res) => {
  let body = req.body.data || req.body
  // 执行登录函数 返回结果
  try {
    loginUser(body.username, body.password, result => {
      console.log(result)
      // 返回数据和token
      res.status(result.code).send({
        data: {
          code: result.code,
          message: result.message
        },
        token: result.token
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

/**
 * @api {post} /apis/user/register 用户注册
 * @apiDescription 用户注册
 * @apiName register
 * @apiGroup auth
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiParam {string} nickname 昵称
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "result": {
 *          "code": 200,
 *          "message": "注册成功"
 *      }
 *  }
 * @apiVersion 0.1.0
 */
router.post('/register', async (req, res) => {
  let body = req.body.data || req.body
  // 执行注册函数 返回结果
  try {
    registerUser(body.username, body.password, body.nickname, result => {
      console.log(result)
      res.status(result.code).send(result)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      code: 500,
      message: '请求错误'
    })
  }
})

// 获取用户信息接口
router.get('/profile', auth, async (req, res) => {
  // 查询用户信息函数
  try {
    getUserProfile(req.rawToken, result => {
      console.log(result)
      res.status(result.code).send(result)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      code: 500,
      message: '请求错误'
    })
  }
})

module.exports = router
