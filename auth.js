const config = require('./config')
const jwt = require('jsonwebtoken')

//토큰 생성
const generateToken = (user) => {
  return jwt.sign({
    _id: user._id,
    name: user.email,
    userId: user.userId,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt
  },
  config.JWT_SECRET,
  {
    expiresIn: '1d',
    issuer: 'hyung'
  })
}
// const bookToken = (book) => {
//   return jwt.sign({
//     _id: book._id,
//     title: book.title,
//     category: book.category,
//     release: book.release,
//     grade: book.grade
//   },
//   config.JWT_SECRET,
//   {
//     expiresIn: '1d',
//     issuer: 'hyung'
//   })
// }

//사용자 확인
const isAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization
  if(!bearerToken){
    res.status(401).json({ code: 401, message: 'Token is not supplied.'})
  }else{
    const token = bearerToken.slice(7, bearerToken.length)
    jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
      if(err && err.name === 'TokenExpiredError'){
        res.status(419).json({code: 419, message: 'Token expired!'})
      }else if(err){
        res.status(401).json({code: 401, message: 'Invalid Token!'})
      }
      req.user = userInfo
      next()
    })
  }
}
// const isAuthBook = (req, res, next) => {
//   const bearerToken = req.headers.authorization
//   if(!bearerToken){
//     res.status(401).json({ code: 401, message: 'bookToken is not supplied.'})
//   }else{
//     const token = bearerToken.slice(7, bearerToken.length)
//     jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
//       if(err && err.name === 'TokenExpiredError'){
//         res.status(419).json({code: 419, message: 'bookToken expired!'})
//       }else if(err){
//         res.status(401).json({code: 401, message: 'Invalid bookToken!'})
//       }
//       req.user = userInfo
//       next()
//     })
//   }
// }

//관리자 확인
const isAdmin = (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next()
  }else{
    res.status(401).json({code: 401, message: 'You are not valid admin user!'})
  }
}

module.exports = {
  generateToken,
  // bookToken,
  isAuth,
  // isAuthBook,
  isAdmin,
}