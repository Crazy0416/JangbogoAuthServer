const myEnv = require('../config/environment');
const chatLogSchema = require('../models/chatLog');
const roomSchema = require('../models/room');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('user connected : ', socket.id);

        // 클라이언트가 방에 입장하고 방 정보와 자신의 이름을 알려줌
        socket.on('setUserInfo', function(info) {
            if(info.memberId && info.roomId){
                socket.memberId = info.memberId;
                socket.nickname = info.nickname;
                socket.roomId = info.roomId;
                if(process.env.NODE_ENV == "dev"){
                    console.log(Date.now(), " SOCKETIO setUserInfo on: ", "set user info to socket");
                }

                socket.join(info.roomId);
                io.sockets.in(info.roomId).emit('broadcast', {
                    msgType: 1,
                    chat: info.nickname + "님께서 입장하셨습니다.",
                    senderNickname: "시스템",
                    time: new Date()
                });
            }
        });

        // 클라이언트가 채팅을 쳤을 때
        socket.on('sendChat', function(chatData) {
            let chatStr = chatData.chat;

            chatLogSchema.create({
              chat: chatStr,
              memberId: socket.memberId,
              roomId: socket.roomId,
              createOn: new Date()
            }, (err, chatLog) => {
                if(err) {
                    console.log(time + " sendChat Error: user: ", socket.memberId,
                        ", room", socket.roomId, " Error: ", err);
                    socket.emit("broadcast", {
                        msgType: -1,
                        chat: "에러: 채팅이 전달되지 않았습니다.",
                        senderNickname: "시스템",
                        time: new Date()
                    })
                } else {
                    if(process.env.NODE_ENV == "dev") {
                        console.log(time + " sendChat event: ", socket.memberId,
                            ", room: ", socket.roomId, " msg: ", chatStr);
                    }
                    io.sockets.in(socket.roomId).emit('broadcast', {
                        msgType: 0,
                        chat: chatStr,
                        senderNickname: socket.nickname,
                        time: new Date()
                    });
                }
            })
        });

        // 클라이언트가 방을 나가겠다는 의미
        socket.on("exitRoom", function() {
            roomSchema.update({roomId: socket.roomId},
                {$pull: {memberIds: {_id: socket.memberId}}},
                {new: true},
                (err, room) => {
                    if(err) {
                        console.log(time + " exitRoom Error: ", socket.memberId,
                            ", room", socket.roomId, " Error: ", err);
                    } else {
                        if(room == null) {
                            console.log(time + "exitRoom SOCKETIO: room doesn't exist");
                            res.status(400).json({
                                "success": false,
                                "msg": "Room doesn't exist",
                                "time": time
                            })
                        } else {
                            if(process.env.NODE_ENV == "dev") {
                                console.log(time, socket.memberId, " exitRoom : ",
                                    ", room: ", socket.roomId);
                            }
                            io.sockets.in(socket.roomId).emit('broadcast', {
                                msgType: 2,
                                chat: socket.nickname + "님이 방을 나가셨습니다.",
                                senderNickname: "시스템",
                                time: new Date()
                            });
                        }
                    }
                })
        });

        // 클라이언트와의 연결 종료
        socket.on('disconnect', function() {
            if(process.env.NODE_ENV == "dev") {
                console.log(time + " user disconnect : ", socket.memberId, ", room: ", socket.roomId);
            }
        })

    })
};