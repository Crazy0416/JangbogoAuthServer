const myEnv = require('../config/environment');

// mongoose setup
const mongoClient = require('mongoose');
const mongoConnectionPoolSize = 10;

// query option
/*
 example mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
 - hostN : maybe you use replica db, you should write host name
*/

const dbURI = myEnv.mongodURL;

// mongoose create connection pool
function connect() {
    mongoClient.connect(dbURI, {
        poolSize: mongoConnectionPoolSize
    });
}

// mongoose connection event handler
mongoClient.connection.on('connected', () => {
    console.log('MONGOOSE: default connection open to ' + dbURI);
    console.log((mongoClient.connection.readyState === 1) ? "MONGOOSE: connect success" : "MONGOOSE: connect fail");
});

mongoClient.connection.on('error', (err) => {
    console.log('MONGOOSE: default connection error: ', err);
});

mongoClient.connection.on('disconnected', () => {
    console.log('MONGOOSE: default connection discoonnected ');
});

process.on('SIGINT', function() {
    mongoClient.connection.close(function() {
        console.log('MONGOOSE: default connection disconnected through app termination');
    });
});

// add schema
//require('../models/member');


//exports module function
exports.connect = connect;