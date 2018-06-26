const myEnv = require("../config/environment");

// redis
const redisClient = require('../modules/redisHandler');

// session
const session = require('express-session');
const redisStore = require('connect-redis')(session);

exports = module.exports = session({
    secret: myEnv.SESSION_SECRET,
    name: 'token',
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 60000
    },
    store: new redisStore({
        client: redisClient,
        ttl: 60000
    }),
    saveUninitialized: true,
    resave: false
});