# Jangbogo(장보고) API 문서 v0.1

## 1. 방 검색 요청

### [GET] /:uid/search/room?filter=\<쿼리1\>[&filter=<쿼리n>]&address=<주소쿼리>

- 메인 페이지에서 사용하는 API. 태그를 url 쿼리에 싣고 보내면 쿼리가 하나라도 들어가있는 방들의 정보들을 배열에 담아 응답한다.
- 만약 로그인이 되어있지 않다면 address 쿼리를 붙여보내야한다.



### Request

- 헤더: 

  - 

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
    "msg": "User's Recommand Room list",
    "time": "2018-07-25T12:20:01.179Z",
    "data": [
        {
            "memberIds": [
                {
                    "_id": "5b586af1441fbc090c62f65c",
                    "uid": "minmin0416",
                    "nickname": "소소한 카스"
                },
                {
                    "_id": "5b586af1441fbc090c62f65f",
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
        },
        {
            "memberIds": [
                {
                    "_id": "5b586af1441fbc090c62f65e",
                    "uid": "test",
                    "nickname": "우아한 자몽"
                },
                {
                    "_id": "5b586af1441fbc090c62f65f",
                    "uid": "test1234",
                    "nickname": "난리난 자몽"
                }
            ],
            "chatLogIds": [],
            "shoppingType": [
                "육류",
                "채소",
                "인스턴트"
            ],
            "_id": "5b544f41159abb082c0eb7f5",
            "title": "저랑 나이 맞는 사람들 찾아요",
            "description": "제가 나이가 어린 편이어서 저랑 비슷한 또래를 구하고 싶어요.",
            "address": "서울 강남구 논현로 ------ (논현동)||06112",
            "isDisable": false,
            "masterMember": "5b544ef1159abb082c0eb7f3",
            "createOn": "2018-07-22T09:32:49.216Z",
            "__v": 1
        }
    ]
}
```