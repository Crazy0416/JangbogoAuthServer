const myEnv = require('../config/environment');
const chatLogSchema = require('../models/chatLog');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('user connected : ', socket.id);

        // 클라이언트가 방에 입장하고 방 정보와 자신의 이름을 알려줌
        io.on('setUserInfo', function(info) {
            if(info.memberId && info.roomId){
                socket.memberId = info.memberId;
                socket.roomId = info.roomId;


            }
        });

        // 클라이언트가 채팅을 쳤을 때
        io.on('sendChat', function(chatData) {
            socket.chatCnt = chatData.chatCnt;

        });

        io.on('reqMoreChat', function(data) {
            let chatCnt= data.chatCnt;
        });

    })
};