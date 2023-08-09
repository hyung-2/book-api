const express = require('express')
const Book = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
const { bookToken, isAuth } = require('../../auth')

const router = express.Router()

//book 생성하기 isAuth 추가시 특정 사용자에 book 생성
router.post('/', expressAsyncHandler(async (req, res, next) => {
  const searchedBook = await Book.findOne({
    title: req.body.title,
    category: req.body.category,
    release: req.body.release
  })
  if(searchedBook){
    console.log(searchedBook)
    res.json(`동일한 책이 있습니다.`)
  }else{
    const book = new Book({
      title: req.body.title,
      category: req.body.category,
      release: req.body.release,
      grade: req.body.grade,
    })
    const newBook = await book.save()
    if(!newBook){
      res.status(401).json({code: 401, message: 'Failed to save book.'})
    }else{
      res.status(201).json({
        code: 201,
        message: 'New book created',
        token: bookToken(newBook),
        newBook
      })
    }
  }
}))


//book 전체 목록 조회
router.get('/', expressAsyncHandler(async (req, res, next) => {
  const books = await Book.find({})
  if(books.length === 0){
    res.status(404).json({code: 404, message: 'This book is not found.'})
  }else{
    res.json({code:200, books})
  }
}))



module.exports = router