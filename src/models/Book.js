const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const bookSchema = new Schema ({
  // author: {
  //   type: ObjectId,
  //   required: true,
  //   ref: 'User',
  // },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  release:{
    type: Number,
    trim: true,
  },
  grade:{
    type: Number,
    trim: true,
  },
})

const Book = mongoose.model('Book',bookSchema)
module.exports = Book