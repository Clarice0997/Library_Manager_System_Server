// 导入express
const express = require('express')

// 实例化Router
const router = express.Router()

// 引入封装登录注册模块
const { loginUser, registerUser, getUserProfile } = require('../model/userModel')

// 导入自定义校验中间件
const auth = require('../utils/auth')

// 登录接口
router.post('/login', async (req, res) => {
  let body = req.body.data || req.body
  // 执行登录函数 返回结果
  loginUser(body.username, body.password, result => {
    console.log(result)
    let data = {
      code: result.code,
      message: result.message
    }
    // 返回数据和token
    res.status(result.code).send({
      data,
      token: result.token
    })
  })
})

// 注册接口
router.post('/register', async (req, res) => {
  let body = req.body.data || req.body
  // 执行注册函数 返回结果
  registerUser(body.username, body.password, body.nickname, result => {
    console.log(result)
    res.status(result.code).send({
      result
    })
  })
})

// 获取用户信息接口
router.get('/profile', auth, async (req, res) => {
  // 查询用户信息函数
  getUserProfile(req.rawToken, result => {
    console.log(result)
    res.status(result.code).send(result)
  })
})

module.exports = router
