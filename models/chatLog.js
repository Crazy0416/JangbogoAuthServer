const mongoClient = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const chatLogSchema = new mongoClient.Schema({
    chat: {
        type: String
    },
    memberId: {
        type: mongoClient.Schema.ObjectId,
        ref: 'member'
    },
    roomId: {
        type: mongoClient.Schema.ObjectId,
        ref: 'room'
    },
    createOn: Date
});

// auto 인덱스
chatLogSchema.plugin(autoIncrement.plugin, 'chatLog');

module.exports = mongoClient.model('chatLog', chatLogSchema);