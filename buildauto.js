const mongoose = require('mongoose')
const User = require('./src/models/User')
const Book = require('./src/models/Book')
const config = require('./config')

//그룹핑할 카테고리
const category = ['소설', '만화', '경제', 'IT', '역사', '에세이']
const rent = [true, false]
let users = []

mongoose.connect(config.MONGODB_URL)
  .then(() => console.log('mongodb 연결...'))
  .catch(e => console.log(`에러났음 - ${e}`))

//랜덤 날짜 생성
const RandomDate = (from, to) => {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()))
}

//배열에서 랜덤값 선택
const selectRandomValue = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

//랜덤 한글 문자열 생성
const randomhanguelString = n => {
  const hanguel = ["김", "하", "박", "정", "수", "희", "지", "우", "은"]
  const str = new Array(n).fill("김")
  return str.map(s => hanguel[Math.floor(Math.random() * hanguel.length)]).join('')
}

//랜덤 영어 문자열 생성
const randomEnglishString = n => {
  const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  const str = new Array(n).fill('a')
  return str.map(s => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

//랜덤 숫자 생성
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min +1)) + min
}


//랜덤 user 데이터 생성
const createUsers = async (n, users) => {
  console.log('랜덤 user 생성중 ...')
  for(let i=0; i<n; i++){
    const user = new User ({
      name: randomhanguelString(3),
      email: `${randomEnglishString(7)}@gmail.com`,
      userId: randomEnglishString(7),
      password: randomEnglishString(10)
    })
    users.push(await user.save())
  }
  return users
}

//랜덤 book 데이터 생성
const createBooks = async (n, user) => {
  console.log(`랜덤 book 생성중...`)
  for(let i=0; i<n; i++){
    const book = new Book({
      rentUsers: user._id,
      title: `${selectRandomValue(category)}${randomNumber(1,5)}`,
      category: selectRandomValue(category),
      grade: `${randomNumber(1,4)}.${randomNumber(0,9)}`,
      isRent : selectRandomValue(rent),
      rentDate: RandomDate(new Date(2023, 3, 1), new Date()),
      finishRentDate: RandomDate(new Date(2023, 3, 1), new Date(2023, 4,))
    })
    await book.save()
  }
}

const buildData = async (users) => {
  users = await createUsers(5, users)
  users.forEach(user => createBooks(5, user))
}

buildData(users)