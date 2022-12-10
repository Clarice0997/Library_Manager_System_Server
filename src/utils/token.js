// 引入jwt模块
const jwt = require('jsonwebtoken')

// 导入环境变量
const dotenv = require('dotenv')
dotenv.config('./.env')

/**
 * 设置Token
 * @param {*} uid
 * @param {*} uname
 * @returns
 */
function setToken(uid, uname) {
  return jwt.sign(
    {
      uid,
      uname
    },
    process.env.SECRET
  )
}

/**
 * 解密Token
 * @param {*} rawToken
 * @returns
 */
function decryptToken(rawToken) {
  return jwt.verify(rawToken, process.env.SECRET)
}

/**
 * 校验token
 * @param {*} rawToken
 * @returns
 */
function verifyToken(rawToken) {
  return Boolean(jwt.verify(rawToken, process.env.SECRET))
}

module.exports = { setToken, decryptToken, verifyToken }
