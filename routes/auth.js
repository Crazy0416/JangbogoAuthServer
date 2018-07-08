'use strict';

const myEnv = require("../config/environment");

// jenkins test2
const express = require('express');
const router = express.Router();
const memberSchema = require('../models/member');
const tagSchema = require('../models/tag');
const addressSchema = require('../models/address');
const redisClient = require('../modules/redisHandler');
const nicknameArray = require("../config/nickname");

// middlewares
const isLogin = require('../middlewares/isLogin');

// crypto
const crypto = require('crypto');

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


// passport local Strategy
passport.use(new LocalStrategy({
        usernameField: 'uid',
        passwordField: 'password'
    }, function(username, password, done) {
        let time = new Date();

        memberSchema.findOne({uid: username}, function(err, user) {
            if(err) {
                console.log(time + " POST /auth/login ERROR: Member Login ERR => " + err);
                return done(err);
            }
            if(!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            let hash = sha512(password, user.salt).passwordHash;

            if(user.password !== hash) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    })
);



// Router Separate

/* GET auth test */
router.get('/', listing);

/* POST 회원가입 */
router.post('/join', isLogin, join);

/* POST 로그인 passport local 전략 사용 */
router.post('/login', isLogin, localLogin);

/* GET 아이디 존재 유무 확인 요청 */
router.get('/check/uid/:uid', isLogin, checkIdinDB);

/* GET 로그인 페이지 렌더링 */
router.get('/login', getLogin);

/* GET 랜덤 닉네임 요청 */
router.get('/nickname', nickname);

// GET /logout
router.get('/logout', logout);





// Router handler


/* GET auth test */
function listing(req, res, next) {
    res.send('jenkins test10');
}

/* POST 로그인 passport local 전략 사용 */
function localLogin(req, res, next) {
    passport.authenticate('local', {
        session: true
    }, function(err, user, info) {      // memberSchema의 user
        if(err) {
            return res.json({
                "success": false,
                "msg": err,
                "time": Date.now()
            });
        }
        if(!user) {
            return res.json({
                "success": false,
                "msg": info.message,
                "time": Date.now()
            });
        }else {
            req.session.uid = user.uid;
            req.session.nickname = user.nickname;

            res.clearCookie("token").json({
                "success": true,
                "msg": "login success",
                "token": "sess:" + req.session.id,
                "time": Date.now()
            });
        }
    })(req, res, next);
}

/* POST 회원가입 */
// TODO: 중간에 변경될 여지가 있을텐데 오류 처리 할 것인가??
function join(req, res, next) {
    let uid = req.body.uid;
    let password = req.body.password;
    let gender = req.body.gender;
    let address = req.body.address;
    let age = req.body.age;
    let shoppingType = req.body.shoppingType;
    let nickname = req.body.nickname;
    let registerTime = new Date();
    let passwordData = saltHashPassword(password);
    let cryptoPassword = passwordData.passwordHash;
    let cryptoSalt = passwordData.salt;

    memberSchema.create({
        uid: uid,
        password: cryptoPassword,
        nickname: nickname,
        gender: gender,
        age: age,
        address: address,
        shoppingType: shoppingType,
        admin: false,
        salt: cryptoSalt,
        createOn: registerTime
    }, (err, member) => {
        if(err) {
            console.log(registerTime + " POST /auth/join ERROR: Member Create ERR => " + err);
            res.status(500).json({
                "success": false,
                "msg": "Member Create ERR",
                "time": registerTime
            })
        } else {
            console.log(registerTime + " POST /auth/join Create: member " + member);

            req.session.uid = member.uid;
            req.session.nickname = member.nickname;

            updateOrCreateAddressByUid(address, member, (err, data) => {
                if(err) {
                    res.status(500).json({
                        "success": false,
                        "msg": "Member Create ERR: " + err.toString(),
                        "data": member,
                        "time": registerTime
                    })
                } else {
                    member.password = undefined;
                    member.salt = undefined;
                    member._id = undefined;

                    res.clearCookie("token").json({
                        "success": true,
                        "token": "sess:" + req.session.id,
                        "msg": "Member Create Success",
                        "data": member,
                        "time": registerTime
                    })
                }
            });
        }
    })
}

function updateOrCreateAddressByUid(address, memberObj, cb) {
    let addressFindPromise = addressSchema.findOne({"address":address});

    addressFindPromise.exec()       // 주소가 존재하는 지 먼저 확인
        .then(function(addressObj) {
            if(addressObj) {   // 주소 존재 => update
                let addressUpdatePromise = addressSchema.updateOne(
                    {address:address},
                    {$push: {members: memberObj._id}});

                addressUpdatePromise.exec()
                    .then(function(updateAddressObj) {
                        if(process.env.NODE_ENV == "production")
                            console.log(Date.now(), " Mongoose: address updateOne ", address);
                        else if(process.env.NODE_ENV == "dev")
                            console.log(Date.now(), " Mongoose: address updateOne ", address, " ", updateAddressObj);
                        cb(null, "Address update: " + address);
                    })
                    .catch(function(errAU) {
                        console.log(Date.now(), " Mongoose: address updateOne Error: ", errAU);
                        cb(errAU);
                    })
            } else {        // 주소 없음 => create
                addressSchema.create({
                    address: address,
                    members: [memberObj._id]
                })
                .then(function(createAddressObj) {
                    if(process.env.NODE_ENV == "production")
                        console.log(Date.now(), " Mongoose: address create ", address);
                    else if(process.env.NODE_ENV == "dev")
                        console.log(Date.now(), " Mongoose: address create ", address, " ", createAddressObj);
                    cb(null, "Address create: " + address);
                })
                .catch(function(errAC) {
                    console.log(Date.now(), " Mongoose: address create Error: ", errAC);
                    cb(errAC);
                })
            }
        })
        .catch(function(errAF) {
            console.log(Date.now(), " Mongoose: address findOne Error: ", errAF);
            cb(errAF);
        })
}

/* TODO: tag 스키마가 필요하면 주석 해제
function updateTagScheamByTagArr(shoppingType, cb) {
    let tagPromiseArr = [];
    for(let i = 0; i < shoppingType.length; i++) {
        let tagPromise = new Promise(function(resolve, reject) {
            tagSchema.findTag(shoppingType[i], (err, tag) => {
                if(err) reject([shoppingType[i], err]);
                else {
                    if (tag) {

                    } else {

                    }
                }
            })
        });

        tagPromiseArr.append(tagPromise);
    }
}
*/


/* GET Random nickname request */
function nickname(req, res, next) {
    //redisClient.get(req.session.uid, function(data) {
        let randNickname = getRandNickname([]);
        //req.session.useNickname = data.useNickname.append(randNickname);

        // TODO: 3번 이상 요청했다면 못하게 오류 처리 해야함
        res.send(randNickname);
    //});
}

function getRandNickname(prevNick) {
    let nickname = "";
    do{
        let randomIndex = getRandomInt(0, nicknameArray.length);
        nickname = nicknameArray[randomIndex];
    } while(prevNick.includes(nickname));

    return nickname;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// encryption functions
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

function sha512(password, salt){
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    let salt = genRandomString(16); /** Gives us salt of length 16 */
    let passwordData = sha512(userpassword, salt);
    return passwordData;
    // console.log('UserPassword = '+userpassword);
    // console.log('Passwordhash = '+passwordData.passwordHash);
    // console.log('nSalt = '+passwordData.salt);
}

function getLogin(req, res, next) {
    res.render('login');
}

function logout(req, res, next) {
    let time = new Date();

    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                console.log(time + " GET /auth/logout ERROR: ", err);
                return res.json({
                    "msg": err
                });
            } else {
                return res.redirect('/');
            }
        });
    }
}

function checkIdinDB(req, res, next) {
    let uid = req.params.uid;

    isNoId(uid)
        .then(function(json) {
            // success: there's no id in db
            res.json(json);
        }, function (errJson) {
            // false: there's id in db or db error
            res.status(errJson.status)
                .json(errJson);
        })
}

function isNoId(uid) {

    return new Promise(function(resolve, reject) {
        let registerTime = Date.now();

        memberSchema.findOne({uid: uid}, (err, user) => {
            if(err) {
                console.log(time + " checkNoId ERROR: Member check id ERR => " + err);
                reject({
                    "success": false,
                    "status": 503,
                    "msg": "Member Check uid ERR",
                    "time": registerTime
                })
            }else if(user) {
                reject({
                    "success": false,
                    "status": 400,
                    "msg": "동일한 아이디가 이미 존재합니다.",
                    "time": registerTime
                })
            } else {
                resolve({
                    "success": true,
                    "msg": "아이디 생성이 가능합니다.",
                    "time": registerTime
                })
            }
        })
    });
}

module.exports = router;
