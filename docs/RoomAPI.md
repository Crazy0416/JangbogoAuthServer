# Jangbogo(장보고) API 문서 v0.1

## 1. 방 생성 요청

### [POST] /:uid/room

- 유저가 방을 만들었을 때 요청하는 API



### Request

- 헤더: 

  - content-type: application/json
  - token: \<저장되어있는 토큰 값\>   // 없다면 빼도 됌

- 바디:

  | 키           | 설명                         | 타입    | 비고                                    |
  | ------------ | ---------------------------- | ------- | --------------------------------------- |
  | title        | 방 이름                      | String  | "맥주 안주 살 사람~"                    |
  | description  | 방 세부 설명                 | String  | "맥주 좋아하는 사람 같이 장 보러가요~~" |
  | address      | 주소                         | String  | " 서울 강동구 상일동 464-1\|\|05291 "   |
  | shoppingType | 방 쇼핑 타입                 | Array   | ["맥주", "남", "육류"]                  |
  | isDisable    | 방을 비활성화 할 건지의 여부 | Boolean | false(활성화 할 것임)                   |



### Response

- 헤더:

- 바디:

  | 키                      | 설명                                  | 타입     | 비고                                          |
  | ----------------------- | ------------------------------------- | -------- | --------------------------------------------- |
  | success                 | 성공 여부                             | Boolean  | success                                       |
  | msg                     | 서버에서 전달할 메세지 내용           | String   | "Member Create Err"                           |
  | time                    | 요청받은 시간                         | Date     |                                               |
  | data                    | 방 정보 데이터                        | Mixed    |                                               |
  | data.chatLogIds         | 채팅 데이터 배열                      | Array    |                                               |
  | data.shoppingType       | 방 쇼핑 특징 배열                     | Array    | ["맥주", "남", "육류"]                        |
  | data.memberIds          | 방에 속하는 유저 json 배열            | Array    |                                               |
  | data.memberIds._id      | 유저 아이디 해쉬 값                   | ObjectId |                                               |
  | data.memberIds.uid      | 유저 아이디                           | String   |                                               |
  | data.memberIds.nickname | 유저 닉네임                           | String   |                                               |
  | data.memberIds.gender   | 유저 성별                             | String   |                                               |
  | data.memberIds.age      | 유저 나이                             | Number   |                                               |
  | data.address            | 방이 만들어 진 주소                   | String   | "서울 강남구 논현로 ------ (논현동)\|\|06112" |
  | data._id                | 방 id값. url에서 주소로 쓰이므로 중요 | String   | "5b488ba85093e32e3411d4b1"                    |
  | data.title              | 방 제목                               | String   | "영통이신분~"                                 |
  | data.isDisable          | 방 비활성화 여부                      | Boolean  | false: 방 활성화, true: 방 비활성화           |

### 예제 response

```javascript
{
    "success": true,
    "msg": "Room Create Success",
    "time": 1531480998896,
    "data": {
        "chatLogIds": [],
        "shoppingType": [
            "맥주",
            "육류"
        ],
        "memberIds": [
            {
                "_id": "5b488b53a89b524b34ef82a1",
                "uid": "minmin0416",
                "nickname": "소소한 카스",
                "gender": "male",
                "age": 25
            }
        ],
        "address": "서울 강남구 논현로 ------ (논현동)||06112",
        "_id": "5b488ba85093e32e3411d4b1",
        "title": "영통이신분~~",
        "isDisable": false
    }
}
```







## 2. 유저가 속한 방 목록 요청(채팅방 목록 데이터)

### [GET] /:uid/room

- 유저가 속한 채팅방 목록을 요청하는 API



### Request

- 헤더:

  - content-type: application/json
  - token: \<저장되어있는 토큰 값\>   // 없다면 빼도 됌
- 바디:



### Response

- 헤더:

- 바디: 

  | 키                            | 설명                                  | 타입    | 비고                                          |
  | ----------------------------- | ------------------------------------- | ------- | --------------------------------------------- |
  | success                       | 성공 여부                             | Boolean | success                                       |
  | msg                           | 서버에서 전달할 메세지 내용           | String  | "Member Create Err"                           |
  | time                          | 요청받은 시간                         | Date    |                                               |
  | data                          | 방 정보 데이터                        | Array   |                                               |
  | data[i].chatLogIds            | 채팅 데이터 배열                      | Array   |                                               |
  | data[i].shoppingType          | 방 쇼핑 특징 배열                     | Array   | ["맥주", "남", "육류"]                        |
  | data[i].memberIds             | 방에 속하는 유저 json 배열            | Array   |                                               |
  | data[i].memberIds[j].uid      | 방 i에 존재하는 유저 j의 uid          | String  | "minmin0416"                                  |
  | data[i].memberIds[j].nickname | 방 i에 존재하는 유저 j의 nickname     | String  | "촉촉한 양파"                                 |
  | data[i].address               | 방이 만들어 진 주소                   | String  | "서울 강남구 논현로 ------ (논현동)\|\|06112" |
  | data[i]._id                   | 방 id값. url에서 주소로 쓰이므로 중요 | String  | "5b488ba85093e32e3411d4b1"                    |
  | data[i].title                 | 방 제목                               | String  | "영통이신분~"                                 |
  | data[i].description           | 방 설명                               | String  | "방 설명~~~"                                  |
  | data[i].isDisable             | 방 비활성화 여부                      | Boolean | false: 방 활성화, true: 방 비활성화           |

### 예제 response

```javascript
{
    "success": true,
    "msg": "Success find user Room list info",
    "time": 1531491714376,
    "data": [
        {
            "_id": "5b488ba85093e32e3411d4b1",
            "memberIds": [
                {
                    "uid": "minmin0416",
                    "nickname": "소소한 카스",
                    "gender": "male",
                    "age": 25
                }
            ],
            "chatLogIds": [],
            "shoppingType": [
                "맥주",
                "육류"
            ],
            "title": "영통이신분~~",
            "description": "방 설명~~~~",
            "address": "서울 강남구 논현로 ------ (논현동)||06112",
            "isDisable": false,
            "__v": 0
        }
    ]
}
```


## 3. 특정 방 정보 요청

### [GET] /:uid/room/:room_id

- 유저가 자신이 들어가있는 채팅방을 열었을 때 채팅 정보등 요청하는 API



### Request

- 헤더: 
  - content-type: application/json
  - token: \<저장되어있는 토큰 값\>   // 없다면 빼도 됌
- 바디:

### Response

- 헤더:

- 바디:

  | 키                      | 설명                                  | 타입    | 비고                                          |
  | ----------------------- | ------------------------------------- | ------- | --------------------------------------------- |
  | success                 | 성공 여부                             | Boolean | success                                       |
  | msg                     | 서버에서 전달할 메세지 내용           | String  | "5b516326602f461364013252 Room info"          |
  | time                    | 요청받은 시간                         | Date    | 1532063680783                                 |
  | data                    | 방 정보 데이터                        | Mixed   |                                               |
  | data.chatLogIds         | 채팅 데이터 배열                      | Array   |                                               |
  | data.shoppingType       | 방 쇼핑 특징 배열                     | Array   | ["맥주", "남", "육류"]                        |
  | data.memberIds          | 방에 속하는 유저 json 배열            | Array   |                                               |
  | data.memberIds.uid      | 유저 아이디                           | String  |                                               |
  | data.memberIds.nickname | 유저 닉네임                           | String  |                                               |
  | data.address            | 방이 만들어 진 주소                   | String  | "서울 강남구 논현로 ------ (논현동)\|\|06112" |
  | data._id                | 방 id값. url에서 주소로 쓰이므로 중요 | String  | "5b488ba85093e32e3411d4b1"                    |
  | data.title              | 방 제목                               | String  | "영통이신분~"                                 |
  | data.description        | 방 설명                               | String  | "방 설명~~~"                                  |
  | data.isDisable          | 방 비활성화 여부                      | Boolean | false: 방 활성화, true: 방 비활성화           |
  | data.createOn           | 방이 생성된 시점                      | Date    | "2018-07-20T04:20:54.191Z"                    |

### 예제 response

```javascript
{
    "success": true,
    "msg": "5b516326602f461364013252 Room info",
    "time": 1532063680783,
    "data": {
        "_id": "5b516326602f461364013252",
        "memberIds": [
            {
                "uid": "minmin0416",
                "nickname": "소소한 카스"
            },
            {
                "uid": "test1234",
                "nickname": "난리난 자몽"
            }
        ],
        "chatLogIds": [],
        "shoppingType": [
            "맥주",
            "육류"
        ],
        "title": "영통이신분~~",
        "description": "방 설명~~~~",
        "address": "서울 강남구 논현로 ------ (논현동)||06112",
        "isDisable": false,
        "createOn": "2018-07-20T04:20:54.191Z",
        "__v": 1
    }
}
```



## 4. 유저가 특정 방 나가기

### [PUT] /:uid/room/exit/:room_id

- 유저가 room_id의 방을 나감



### Request

- 헤더: 
  - token: \<저장되어있는 토큰 값\>   // 없다면 빼도 됌
- 바디:

### Response

- 헤더:

- 바디:

  | 키      | 설명                        | 타입    | 비고                     |
  | ------- | --------------------------- | ------- | ------------------------ |
  | success | 성공 여부                   | Boolean | success                  |
  | msg     | 서버에서 전달할 메세지 내용 | String  | "User Exit Room success" |
  | time    | 요청받은 시간               | Date    | 1532063680783            |

### 예제 response

```javascript
{
    "success": true,
    "msg": "User Exit Room success",
    "time": 1532063680783
}
```



## 5. 특정 방에 join하기

### [GET] /:uid/room/:room_id

- 유저가 자신이 들어가있는 채팅방을 열었을 때 채팅 정보등 요청하는 API



### Request

- 헤더: 
  - token: \<저장되어있는 토큰 값\>   // 없다면 빼도 됌
- 바디:

### Response

- 헤더:

- 바디:

  | 키                      | 설명                                  | 타입    | 비고                                          |
  | ----------------------- | ------------------------------------- | ------- | --------------------------------------------- |
  | success                 | 성공 여부                             | Boolean | success                                       |
  | msg                     | 서버에서 전달할 메세지 내용           | String  | "5b516326602f461364013252 Room info"          |
  | time                    | 요청받은 시간                         | Date    | 1532063680783                                 |
  | data                    | 방 정보 데이터                        | Mixed   |                                               |
  | data.chatLogIds         | 채팅 데이터 배열                      | Array   |                                               |
  | data.shoppingType       | 방 쇼핑 특징 배열                     | Array   | ["맥주", "남", "육류"]                        |
  | data.memberIds          | 방에 속하는 유저 json 배열            | Array   |                                               |
  | data.memberIds.uid      | 유저 아이디                           | String  |                                               |
  | data.memberIds.nickname | 유저 닉네임                           | String  |                                               |
  | data.address            | 방이 만들어 진 주소                   | String  | "서울 강남구 논현로 ------ (논현동)\|\|06112" |
  | data._id                | 방 id값. url에서 주소로 쓰이므로 중요 | String  | "5b488ba85093e32e3411d4b1"                    |
  | data.title              | 방 제목                               | String  | "영통이신분~"                                 |
  | data.description        | 방 설명                               | String  | "방 설명~~~"                                  |
  | data.isDisable          | 방 비활성화 여부                      | Boolean | false: 방 활성화, true: 방 비활성화           |
  | data.createOn           | 방이 생성된 시점                      | Date    | "2018-07-20T04:20:54.191Z"                    |

### 예제 response

```javascript
{
    "success": true,
    "msg": "Room joined!!",
    "time": "2018-07-20T05:30:10.205Z",
    "data": {
        "memberIds": [
            {
                "uid": "minmin0416",
                "nickname": "소소한 카스"
            },
            {
                "uid": "test1234",
                "nickname": "난리난 자몽"
            }
        ],
        "chatLogIds": [],
        "shoppingType": [
            "맥주",
            "육류"
        ],
        "_id": "5b516326602f461364013252",
        "title": "영통이신분~~",
        "description": "방 설명~~~~",
        "address": "서울 강남구 논현로 ------ (논현동)||06112",
        "isDisable": false,
        "createOn": "2018-07-20T04:20:54.191Z",
        "__v": 2
    }
}
```

