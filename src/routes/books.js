const express = require('express')
const Book = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const mongoose = require('mongoose')
const { Types: {ObjectId} } = mongoose

const router = express.Router()

//book 생성하기 isAuth 추가시 특정 사용자에 book 생성
router.post('/', expressAsyncHandler(async (req, res, next) => {
  const searchedBook = await Book.findOne({
    title: req.body.title,
    category: req.body.category,
  })
  if(searchedBook){
    console.log(searchedBook)
    res.json(`동일한 책이 있습니다.`)
  }else{
    const book = new Book({
      title: req.body.title,
      category: req.body.category,
      grade: req.body.grade,
    })
    const newBook = await book.save()
    if(!newBook){
      res.status(401).json({code: 401, message: 'Failed to save book.'})
    }else{
      res.status(201).json({
        code: 201,
        message: 'New book created',
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

//사용자가 특정book 렌트/반납하기
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const rent = await Book.findOne({
    _id: req.params.id,
    title: req.body.title,
    // isRent: false
  })
  if(!rent){
    res.status(404).json({code: 404, message: 'Book not found'})
  }else if(req.body.isRent == false){
    console.log(rent.isRent)
    rent.rentUsers = req.user._id
    rent.isRent = true
    rent.rentDate = new Date()
    rent.finishRentDate = rent.isRent ?  rent.rentDate : rent.finishRentDate
    
    const rentBook = await rent.save()
    res.json({
      code:200,
      message: '성공적으로 책을 빌렸습니다.',
      rentBook
    })
  }else if(req.body.isRent == true){
    console.log(rent.isRent)
    rent.rentUsers = req.user._id
    rent.isRent = false
    rent.rentDate = new Date()
    rent.finishRentDate = rent.isRent ?  rent.rentDate : rent.finishRentDate
    
    const rentBook = await rent.save()
    res.json({
      code:200,
      message: '성공적으로 책을 반납했습니다.',
      rentBook
    })
  }else if(rent.isRent == false){
    res.json({message: '책이 있는 상태입니다.'})
  }else{res.status(401).json({message: '누군가 이미 빌려갔습니다.'})}
}))

//사용자의 특정 book 목록 조회
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const book = await Book.findOne({
    rentUsers: req.user._id,
    _id: req.params.id
  })
  if(!book){
    res.status(404).json({code: 404, message:'빌린 책이 없습니다.'})
  }else{
    res.json({code: 200, book})
  }
}))

//특정 book 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const book = await Book.findOne({
    rentUsers: req.user._id,
    _id: req.params.id
  })
  if(!book){
    res.status(404).json({code: 404, message: 'Book Not Found'})
  }else{
    await Book.deleteOne({
      rentUsers: req.user._id,
      _id: req.params.id
    })
    res.status(204).json({code: 204, message: 'This Book deleted Successfully'})
  }
}))

//그룹핑 
router.get('/group/:field', isAuth, expressAsyncHandler(async (req, res, next) => {
  if(!req.user.isAdmin){
    res.status(401).json({code: 401, message: '님 관리자 아님'})
  }else{
    const docs = await Book.aggregate([
      {$group: {
        _id: `$${req.params.field}`,
        count: {$sum: 1}
      }}
    ])
    console.log(`Number of group: ${docs.length}`)
    docs.sort((d1, d2) => d1._id - d2._id)
    res.json({code: 200, docs})
  }
}))

//사용자 본인의 book 그룹핑
router.get('/group/mine/:field', isAuth, expressAsyncHandler(async (req, res, next) => {
  const docs = await Book.aggregate([
    {$match: { rentUsers: new ObjectId(req.user._id)}},
    {$group: {
      _id: `$${req.params.field}`,
      count: {$sum: 1}
    }}
  ])
  console.log(`Number of group: ${docs.length}`)
  docs.sort((d1, d2) => d1._id - d2._id)
    res.json({code: 200, docs})
}))

//날짜 기준 그룹핑
router.get('/group/date/:field', isAuth, expressAsyncHandler(async (req, res, next) => {
  if(!req.user.isAdmin){
    res.status(401).json({code: 401, message: '님 관리자 아니라고요 ㅋㅋ'})
  }else{
    if(req.params.field === 'rentDate' || req.params.field === 'finishRentDate'){
      const docs = await Book.aggregate([
        {$group: {
          _id: {year: {$year: `$${req.params.field}`}, month: {$month: `$${req.params.field}`}},
          count: {$sum: 1}
        }},
        {$sort: {_id: 1}}
      ])
      console.log(`Number of gruop: ${docs.length}`)
      docs.sort((d1, d2) => d1._id - d2._id)
      res.json({code: 200, docs})
    }else{
      res.status(204).json({code: 204, message: 'No content'})
    }
  }
}))

//사용자 본인의 날짜 기준 그룹핑
router.get('/group/mine/date/:field', isAuth, expressAsyncHandler(async (req, res, next) => {
  if(req.params.field === 'rentDate' || req.params.field === 'finishRentDate'){
    const docs = await Book.aggregate([
      {$match: { rentUsers: new ObjectId(req.user._id)}},
      {$group: {
        _id: {year: {$year: `$${req.params.field}`}, month: {$month: `$${req.params.field}`}},
        count: {$sum: 1}
      }},
      {$sort: {_id: 1}}
    ])
    console.log(`Number of gruop: ${docs.length}`)
    docs.sort((d1, d2) => d1._id - d2._id)
    res.json({code: 200, docs})
  }else{
    res.status(204).json({code: 204, message: 'No content'})
  }
}))


module.exports = router