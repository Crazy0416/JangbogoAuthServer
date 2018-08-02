const myEnv = require("../config/environment");

// redis
const redisClient = require('../modules/redisHandler');

// session
const session = require('express-session');
const redisStore = require('connect-redis')(session);

exports = module.exports = session({
    secret: myEnv.SESSION_SECRET,
    name: 'jangtoken',
    store: new redisStore({
        client: redisClient,
        ttl: 60000
    }),
    saveUninitialized: false,
    resave: false
});