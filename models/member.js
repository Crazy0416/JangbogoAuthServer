const mongoClient = require('mongoose');

const memberSchema = new mongoClient.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    shoppingType: {
       type: [String]       // TODO: tag 타입을 만들 것인가??
    },
    admin: Boolean,
    salt: {
        type: String,
        required: true
    },
    createOn: Date
});

module.exports = mongoClient.model('member', memberSchema);