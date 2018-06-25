const myEnv = require('../config/environment');

const REDIS_PORT = myEnv.REDISPORT;
const REDIS_IP = myEnv.REDISIP;

// redis
const redis = require('redis');
const redisClient = redis.createClient(REDIS_PORT, REDIS_IP);

redisClient.on("error", function (err) {
    console.log("REDIS: ERR " + err);
});

redisClient.on("connect", function () {
    console.log("REDIS: default connection open to " + REDIS_IP + ":" + REDIS_PORT);
});

redisClient.on("ready", function () {
    console.log("REDIS: ready to use redis");
});

redisClient.on("end", function () {
    console.log("REDIS: default connection disconnected");
});

process.on('SIGINT', function() {
    redisClient.quit();
    console.log('REDIS: default connection disconnected through app termination');
});

module.exports = redisClient;