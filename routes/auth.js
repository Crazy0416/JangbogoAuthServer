const express = require('express');
const router = express.Router();
const memberSchema = require('../models/member');
const redisClient = require('../modules/redisHandler');
const nicknameArray = require("../config/nickname");

//passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// passport local Strategy
passport.use(new LocalStrategy(function(username, password, done) {

}));

/* GET auth test */
router.get('/', listing);

/* POST 회원가입 */
router.post('/register', register);

/* POST 로그인 passport local 전략 사용 */
router.post('/login', passport.authenticate('local', {
    successRedirect:'/welcome',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

/* GET Random nickname request */
router.get('/nickname', nickname);





/* GET auth test */
function listing(req, res, next) {
    res.send('respond with a resource');
}

/* POST 회원가입 */
function register(req, res, next) {
    let id = req.body.id;
    let password = req.body.password;
    let gender = req.body.gender;
    let address = req.body.address;
    let age = req.body.age;
    let shoppingType = req.body.shoppingType;
    let nickname = req.body.nickname;


}

/* GET Random nickname request */
function nickname(req, res, next) {
    redisClient.get(req.session.id, function(data) {
        let randNickname = getRandNickname(data.useNickname);
        req.session.useNickname = data.useNickname.append(randNickname);
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

module.exports = router;
