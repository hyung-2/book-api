const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./config')
const userRouter = require('./src/routes/users')
const bookRouter = require('./src/routes/books')
const rentRouter = require('./src/routes/rents')

mongoose.connect(config.MONGODB_URL)
  .then(() => console.log('mongodb connected ...'))
  .catch(e => console.log(`failed to connect mongodb : ${e}`))

app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/books', bookRouter)
app.use('/api/rents', rentRouter)


app.listen(5100, () => {
  console.log('server is running on port 5100 ...')

})