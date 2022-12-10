// 导入express
const express = require('express')

// 实例化Router
const router = express.Router()

// 导入自定义校验中间件
const auth = require('../utils/auth')

// import
const { getUsersInfo } = require('../model/userManagerModel')

router.get('/getInfo', auth, async (req, res) => {
  res.send('ok')
})

module.exports = router
