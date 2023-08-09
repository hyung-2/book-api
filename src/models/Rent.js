const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const rentSchema = new Schema({
bookObjectId:{
  type: String,
  required: true,
},
rentUsers: [{ 
  type : ObjectId, 
  ref: 'User', 
  required: true,
}],
userEmail:{
  type: String,
  required: true,
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


const Rent = mongoose.model('rent',rentSchema)
module.exports = Rent