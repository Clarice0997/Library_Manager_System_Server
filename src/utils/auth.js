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
    await next()
  }
}

module.exports = auth
