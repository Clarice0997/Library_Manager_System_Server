// 导入express|实例化express
const express = require('express')
const app = new express()

// 导入处理json格式模块
app.use(express.json())

// 导入cors中间件 处理跨域
const cors = require('cors')
app.use(cors())

// 导入路径处理模块
const path = require('path')

// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('../.env')

// 全局设置响应头
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3050')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

// 接口测试
app.get('/apis', (req, res) => {
  res.send('ok')
})

// 创建路由
app.use('/apis/user', require('./routes/user'))
app.use('/apis/userManager', require('./routes/userManager'))

// 接口文档
app.use(express.static(path.join(__dirname, 'public')))

// 配置端口 启动监听服务端
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`${PORT}端口监听中...`)
})
