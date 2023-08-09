const express = require('express')
const Rent = require('../models/Rent')
const expressAsyncHandler = require('express-async-handler')
const { isAuth, isAuthBook } = require('../../auth')

const router = express.Router()

//특정 사용자가 책을 빌렸을때

router.post('/', isAuth, isAuthBook, expressAsyncHandler(async (req, res, next) => {
  const searchedrent = await Rent.findOne({
    rentUsers: req.user._id,
    title: req.body.title,
  })
  if(searchedrent){
    res.status(204).json({code: 204, message: '이미 빌려간 책입니다.'})
  }else{
    console.log(req.body)
    const rent = new Rent({
      rentUsers: req.user._id,
      bookObjectId: req.body.bookid,
      userEmail: req.body.email,
      title: req.body.title,
      isRent: true
    })
    const newRent = await rent.save()
    if(!newRent){
      res.status(401).json({code: 401, message: 'Failed to rent this book'})
    }else{
      res.status(201).json({
        code: 201,
        message: 'sucessfully rent this book',
        newRent
      })
    }
  }
}))






module.exports = router