# 장보고
## config
- 환경변수: NODE_ENV=\<dev or production\>
- config/environment.js 파일

## dependency
- mongodb
- redis
- config/environment.js
- nickname.json


## 사용한 기법
1. jenkins와 webhook을 이용하여 자동배포
2. pm2를 이용하여 node 프로세스 관리
3. 환경변수에 NODE_ENV=env 혹은 production으로 설정해주면 config/environment.js파일에서 dev환경과 production환경으로 바로 바꿀 수 있도록 함.
4. mongod와 redis의 이벤트 핸들링을 modules 디렉토리에 mongooseHandler.js와 redisHandler.js로 나누어 쉽게 핸들링 할 수 있도록 하였다.
5. routes/router들의 url을 한눈에 보기 쉽게 middleware를 파일 밑 부분에 따로 정리하였다.

## config/environment.js
```
if(process.env.NODE_ENV == "dev") {
    module.exports = {
        "mongodURL": <dev mongodb config>,
        "REDISPORT": <dev redis port>,
        "REDISIP": <dev redis ip>
        ...
    }
} else if(process.env.NODE_ENV == "production") {
    module.exports = {
        "mongodURL": <production mongodb config>,
        "REDISPORT": <production redis port>,
        "REDISIP": <production redis ip>
        ...
    }
}
```