const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const bookSchema = new Schema ({
  rentUsers: [{ 
    type : ObjectId, 
    ref: 'User', 
    // required: true,/
  }],
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  grade:{
    type: Number,
    trim: true,
  },
  isRent: {
    type: Boolean,
    default: false,
  },
  rentDate: {
    type: Date,
    default: Date.now,
  },
  finishRentDate:{
    type: Date,
    default: Date.now,
  },
})

const Book = mongoose.model('Book',bookSchema)
module.exports = Book