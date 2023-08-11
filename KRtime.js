const time = new Date()

const utc = 
      time.getTime() + 
      (time.getTimezoneOffset() * 60 * 1000)


//한국은 utc보다 9시간 빠름: 9시간 값 구하기
const Korea = 9 * 60 * 60 *1000

const KoreaTime = new Date((new Date()).getTime() + Korea)
const KrTime = Date.now()+Korea

console.log(KoreaTime)
module.exports = {
  KoreaTime,
  Korea
}

//저장해서 서버가 리셋될때의 시간만 적용되고 테스터에서 Send키로는 시간이 반영되지않음