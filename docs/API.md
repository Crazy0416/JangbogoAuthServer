# Jangbogo(장보고) API 문서 v0.1

## 회원가입

### [POST] /auth/join

- 장보고 회원가입을 위한 API



### Request

- 헤더: 

  - content-type: application/json

- 바디:

  | 키           | 설명                            | 타입   | 비고                              |
  | ------------ | ------------------------------- | ------ | --------------------------------- |
  | uid          | 아이디                          | String |                                   |
  | password     | 비밀번호                        | String |                                   |
  | gender       | 성별                            | String | male, female 중 하나              |
  | address      | 사는 주소                       | String | 경기도 수원시 영통구 매영로       |
  | age          | 나이                            | Number | 23                                |
  | shoppingType | 주요 쇼핑 태그                  | Array  | ["맥주", "안주", "중화요리", ...] |
  | nickname     | 장보고 서비스에서 사용할 닉네임 | String | 곱슬머리인 쪽파리우스             |



### Response

- 헤더

- 바디:

  | 키      | 설명                        | 타입    | 비고                               |
  | ------- | --------------------------- | ------- | ---------------------------------- |
  | success | 성공 여부                   | Boolean | true                               |
  | msg     | 서버에서 전달할 메세지 내용 | String  | "Member Create Success"            |
  | data    | 생성한 유저 json            | JSON    | success가 false일 경우 data는 없음 |
  | time    | 요청받은 시간               | Date    |                                    |



## 로그인

### [POST] /auth/login

- 장보고 로그인을 하기 위한 API. 반환하는 토큰을 쿠키에 저장하여야 한다.



### Request

- 헤더:

  - content-type: application/json

- 바디:

  | 키       | 설명     | 타입   | 비고 |
  | -------- | -------- | ------ | ---- |
  | uid      | 아이디   | String |      |
  | password | 비밀번호 | String |      |



### Response

- 헤더:

- 바디:

  | 키      | 설명                        | 타입    | 비고                    |
  | ------- | --------------------------- | ------- | ----------------------- |
  | success | 성공 여부                   | Boolean | true                    |
  | msg     | 서버에서 전달할 메세지 내용 | String  | "Member Create Success" |
  | time    | 요청받은 시간               | Date    |                         |



## 아이디 인증

### [GET] /auth/id/:id

- 장보고 서버에 이미 아이디가 존재하는 지 인증한다. 아이디가 이미 존재하면 만들 수 없도록 프론트에서 설정해야한다.



### Request

- 헤더:
  - content-type: application/json
- 바디:

### Response

- 헤더:

- 바디:

  | 키      | 설명                        | 타입    | 비고                       |
  | ------- | --------------------------- | ------- | -------------------------- |
  | success | 성공 여부                   | Boolean | true                       |
  | msg     | 서버에서 전달할 메세지 내용 | String  | "The member already exist" |
  | time    | 요청받은 시간               | Date    |                            |



## 랜덤한 닉네임 요청

### [GET] /auth/nickname?id=\<id\>

- 랜덤한 닉네임을 서버에 요청하여 닉네임으로 사용
- 회원가입 도중 입력한 id를 키값으로 하여 이미 사용한 닉네임을 서버에서 저장하기 때문에 보내줄 때 id가 필요
- 만약 무제한 발급이면 쿼리에 id 필요없음



### Request

- 헤더:
  - content-type: application/json
- 바디:

### Response

- 헤더:

- 바디:

  | 키      | 설명                        | 타입    | 비고                       |
  | ------- | --------------------------- | ------- | -------------------------- |
  | success | 성공 여부                   | Boolean | true                       |
  | msg     | 서버에서 전달할 메세지 내용 | String  | "The member already exist" |
  | data    | 닉네임                      | String  | "쪽파리우스"               |
  | time    | 요청받은 시간               | Date    |                            |



