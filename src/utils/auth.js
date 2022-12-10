// 校验Token是否合法
const { verifyToken } = require('../utils/token')

// 设置校验中间件
const auth = async (req, res, next) => {
  // 获取校验码
  const rawToken = String(req.headers.authorization).split(' ').pop()
  // 校验状态
  let verify = false
  // 判断token是否合法 抛出异常（避免token不合法）
  try {
    verify = verifyToken(rawToken)
  } catch (error) {
    console.log(error)
  }
  // 判断校验状态
  if (!verify) {
    res.status(500).send({
      message: '身份验证失败'
    })
  } else {
    // 为请求头赋值
    req.rawToken = rawToken
    await next()
  }
}

module.exports = auth
