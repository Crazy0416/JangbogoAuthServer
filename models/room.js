const mongoClient = require('mongoose');

const roomSchema = new mongoClient.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
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
    address: String,
    isDisable: {
        type: Boolean,
        required: true
    },
    masterMember: {
        type: mongoClient.Schema.ObjectId,
        ref: 'member'
    },
    createOn: Date
});

roomSchema.path('title').validate(function(value) {
   return true;
});

module.exports = mongoClient.model('room', roomSchema);