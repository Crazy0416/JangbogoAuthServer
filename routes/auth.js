'use strict';
// jenkins test
const express = require('express');
const router = express.Router();
const memberSchema = require('../models/member');
const redisClient = require('../modules/redisHandler');
const nicknameArray = require("../config/nickname");

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
router.post('/join', join);

/* POST 로그인 passport local 전략 사용 */
router.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/auth/login',
    session: true
}));

/* GET 로그인 페이지 렌더링 */
router.get('/login', getLogin);

/* GET Random nickname request */
router.get('/nickname', nickname);

/* GET auth test */
function listing(req, res, next) {
    res.send('respond with a resource');
}



// Router handler

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
            res.json({
                "success": true,
                "msg": "Member Create Success",
                "data": member,
                "time": registerTime
            })
        }
    })
}


// middleware


/* GET Random nickname request */
function nickname(req, res, next) {
    redisClient.get(req.session.uid, function(data) {
        let randNickname = getRandNickname(data.useNickname);
        req.session.useNickname = data.useNickname.append(randNickname);

        // TODO: 3번 이상 요청했다면 못하게 오류 처리 해야함
        res.send(randNickname);
    });
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
module.exports = router;
