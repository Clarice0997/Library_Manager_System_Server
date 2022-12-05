// 导入express|实例化express
const express = require('express')
const app = new express()

// 导入处理json格式模块
app.use(express.json())

// 导入cors中间件
const cors = require('cors')
app.use(cors())

// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('./.env')

// 设置校验中间件
const auth = async (req, res, next) => {
  // 获取校验码
  const rawToken = String(req.headers.authorization).split(' ').pop()
  // 判断是否存在校验码
  if (rawToken == 'undefined') {
    res.status(500).send({
      message: '身份验证失败'
    })
  } else {
    // 为请求头赋值
    req.rawToken = rawToken
    next()
  }
}

// 全局设置响应头
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3050')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

// 引入封装登录注册模块
const { loginUser, registerUser } = require('./models')
// 导入获取用户个人信息模块
const { getUserProfile } = require('./models')

// 接口测试
app.get('/apis', (req, res) => {
  res.send('ok')
})

// 登录接口
app.post('/apis/login', async (req, res) => {
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
app.post('/apis/register', async (req, res) => {
  let body = req.body.data || req.body
  // 执行注册函数 返回结果
  registerUser(body.username, body.password, result => {
    console.log(result)
    res.status(result.code).send({
      result
    })
  })
})

// 获取用户信息接口
app.get('/apis/profile', auth, async (req, res) => {
  // 查询用户信息函数
  getUserProfile(req.rawToken, result => {
    console.log(result)
    res.status(result.code).send(result)
  })
})

// 配置端口 启动监听服务端
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`${PORT}端口监听中...`)
})
