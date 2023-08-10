const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')

const router = express.Router()

//회원가입
router.post('/register', expressAsyncHandler(async (req, res, next) => {
  console.log(req.body)
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    userId: req.body.userId,
    password: req.body.password,
  })
  const newUser = await user.save()
  if(!newUser){
    res.status(401).json({code: 401, message: 'Invalid User Data'})
  }else{
    const {name, email, userId, isAdmin, createdAt} = newUser
    res.status(200).json({
      code: 200, 
      message: '회원가입 성공!',
      token: generateToken(newUser),
      name, email, userId, isAdmin, createdAt
    })
  }
})
)

//로그인
router.post('/login', expressAsyncHandler(async (req, res, next) => {
  console.log(req.body)
  const loginUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  })
  if(!loginUser){
    res.status(401).json({code: 401, message: 'Invalid Email or Password'})
  }else{
    const { name, email, userId, isAdmin, createdAt } = loginUser
    res.json({
      code: 200,
      message: '로그인 성공!',
      token: generateToken(loginUser),
      name, email, userId, isAdmin, createdAt
    })
  }
})
)

//로그아웃
router.post('/logout', (req, res, next) => {
  res.json('로그아웃')
})

//사용자 정보 변경
router.put('/:id', expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if(!user){
    res.status(404).json({code: 404, message: 'User Not Found.'})
  }else{
    console.log(req.body)
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.password = req.body.password || user.password
    user.isAdmin = req.body.isAdmin || user.isAdmin

    const updateUser = await user.save()
    const { name, email, userId, isAdmin, createdAt } = updateUser
    res.json({
      code: 200,
      message: '사용자 정보 변경 성공!',
      token: generateToken(updateUser),
      name, email, userId, isAdmin, createdAt
    })
  }
})
)

//사용자 정보 삭제
router.delete('/:id', expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if(!user){
    res.status(404).json({code: 404, message: 'User Not Found!'})
  }else{
    res.status(204).json({code: 204, message: '사용자 정보를 삭제했습니다.'})
  }
})
)

module.exports = router