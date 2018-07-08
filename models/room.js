const mongoClient = require('mongoose');

const roomSchema = new mongoClient.Schema({
    title: {
        type: String,
        required: true
    },
    memberIds: [{
        type: mongoClient.Schema.ObjectId,
        ref: 'member'
    }],
    chatLogIds: [{
        type: mongoClient.Schema.ObjectId,
        ref: 'chatLog'
    }],
    shoppingType: [{
        type: String
    }],
    address: {
        type: mongoClient.Schema.ObjectId,
        ref: 'address'
    },
    isDisable: {
        type: Boolean,
        required: true
    },
    createOn: Date
});

module.exports = mongoClient.model('room', roomSchema);