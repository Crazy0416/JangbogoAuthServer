'use strict';
// my Environment Variable
const myEnv = require("../config/environment");

const express = require('express');
const router = express.Router();
const checkToken = require('../middlewares/checkToken');

// models
const memberSchema  = require("../models/member");
const addressSchema = require("../models/address");
const roomSchema = require("../models/room");

// router
/* POST 유저가 방을 생성*/
router.post('/', checkToken, createRoom);

/* GET 유저가 속한 방 목록 요청*/
router.get('/', checkToken, getUserRoomInfo);

/* GET 유저가 속한 특정 방 요청*/
router.get('/:room_id', checkToken, getRoomInfo);

/* DELETE 유저가 자신이 속한 특정 방을 나감 */
router.delete('/:room_id', checkToken, deleteRoom);



// router handler
function createRoom(req, res, next) {
    let title = req.body.title;
    let description = req.body.description;
    let uid = req.session.uid;
    let address = req.body.address;
    let shoppingType = req.body.shoppingType;
    let isDisable = req.body.isDisable;
    let time = Date.now();

    memberSchema.findOne({uid: uid}, (errM, memberObj) => {
        if(errM) {
            console.log(time + " POST /:uid/room ERROR: Member find ERR => " + errM);
            res.status(500).json({
                "success": false,
                "msg": "Member find ERR",
                "time": time
            })
        } else {
            let memberId = memberObj._id;
            addressSchema.findOne({address: address}, (errA, addressObj) => {
                if(errA) {
                    console.log(time + " POST /:uid/room ERROR: Address find ERR => " + errA);
                    res.status(500).json({
                        "success": false,
                        "msg": "Address find ERR",
                        "time": time
                    })
                } else {
                    let addressName = addressObj.address;

                    roomSchema.create({
                        title: title,
                        memberIds:[memberId],
                        shoppingType: shoppingType,
                        description: description,
                        address: addressName,
                        isDisable: isDisable,
                        createOn: new Date()
                    })
                        .then(function(room) {
                            memberSchema.findByIdAndUpdate(memberObj._id, {$push: {roomIds: room._id}}).exec()
                                .then(function (UpdatememberObj) {
                                    if(UpdatememberObj == null) {
                                        console.log(time + " POST /:uid/room ERROR: Member doesn't Exist");
                                        res.status(500).json({
                                            "success": false,
                                            "msg": "Member Update ERR",
                                            "time": time
                                        })
                                    } else {
                                        res.json({
                                            "success": true,
                                            "msg": "Room Create Success",
                                            "time": time,
                                            "data": {
                                                "chatLogIds": room.chatLogIds,
                                                "shoppingType": room.shoppingType,
                                                "memberIds": [{
                                                    _id: memberObj._id,
                                                    uid: memberObj.uid,
                                                    nickname: memberObj.nickname,
                                                    gender: memberObj.gender,
                                                    age: memberObj.age
                                                }],
                                                "address" : addressObj.address,
                                                "_id": room._id,
                                                "title": room.title,
                                                "isDisable": room.isDisable
                                            }
                                        })
                                    }
                                })
                                .catch(function (errUM) {
                                    console.log(time + " POST /:uid/room ERROR: Member Update ERR => " + errUM);
                                    res.status(500).json({
                                        "success": false,
                                        "msg": "Member Update ERR",
                                        "time": time
                                    })
                                });
                        })
                        .catch(function(errR) {
                            if (errR) {
                                console.log(time + " POST /:uid/room ERROR: Room Create ERR => " + errR);
                                res.status(500).json({
                                    "success": false,
                                    "msg": "Room Create ERR",
                                    "time": time
                                })
                            }
                        })
                }
            })
        }
    })
}

function getUserRoomInfo(req, res, next) {
    let time = Date.now();

    // TODO: 채팅이 제일 최근에 온 것으로 sorting

    memberSchema.findOne({uid: req.session.uid})
        .populate([{
            path: 'roomIds',
            model: 'room'
        }, {
            path: 'roomIds',
            model: 'room',
            populate: {
                path: 'memberIds',
                model: 'member'
            }
        }])
        .lean()
        .exec((err, member) => {
            if(err) {
                console.log(time + " GET /:uid/room ERROR: Member Find ERR => " + err);
                res.status(500).json({
                    "success": false,
                    "msg": "Room Create ERR",
                    "time": time
                })
            } else {
                if(member == null) {
                    console.log(time + " GET /:uid/room ERROR: Member doesn't exist");
                    res.status(400).json({
                        "success": false,
                        "msg": "Member doesn't exist",
                        "time": time
                    })
                } else {
                    console.log(member);
                    for(let i = 0; i < member.roomIds.length; i++) {
                        for(let j = 0; j < member.roomIds[i].memberIds.length; j++) {
                            member.roomIds[i].memberIds[j]._id = undefined;
                            member.roomIds[i].memberIds[j].shoppingType = undefined;
                            member.roomIds[i].memberIds[j].roomIds = undefined;
                            member.roomIds[i].memberIds[j].password = undefined;
                            member.roomIds[i].memberIds[j].address = undefined;
                            member.roomIds[i].memberIds[j].admin = undefined;
                            member.roomIds[i].memberIds[j].salt = undefined;
                            member.roomIds[i].memberIds[j].createOn = undefined;
                            member.roomIds[i].memberIds[j].__v = undefined;
                            member.roomIds[i].memberIds[j].age = undefined;
                            member.roomIds[i].memberIds[j].gender = undefined;
                        }
                    }

                    res.json({
                        "success": true,
                        "msg": "Success find user Room list info",
                        "time": time,
                        "data" : member.roomIds
                    });
                }
            }
        })
}

function getRoomInfo(req, res, next) {
    let time = Date.now();

    roomSchema.findById(req.params.room_id)
        .populate({
            path: 'memberIds',
            model: 'member'
        })
        .lean()
        .exec((err, room) => {
            if(err) {
                console.log(time + " GET /:uid/room/:room_id ERROR: Room Find ERR => " + err);
                res.status(500).json({
                    "success": false,
                    "msg": "Room Find ERR",
                    "time": time
                })
            } else {
                if(room == null) {
                    console.log(time + " GET /:uid/room/:room_id ERROR: Room doesn't exist");
                    res.status(400).json({
                        "success": false,
                        "msg": "Room doesn't exist",
                        "time": time
                    })
                } else {
                    for(let i = 0; i < room.memberIds.length; i++) {
                        room.memberIds[i].shoppingType = undefined;
                        room.memberIds[i].roomIds = undefined;
                        room.memberIds[i].password = undefined;
                        room.memberIds[i].salt = undefined;
                        room.memberIds[i].admin = undefined;
                        room.memberIds[i].createOn = undefined;
                        room.memberIds[i]._id = undefined;
                        room.memberIds[i].gender = undefined;
                        room.memberIds[i].age = undefined;
                        room.memberIds[i].__v = undefined;
                        room.memberIds[i].address = undefined;
                    }
                    res.json({
                        "success": true,
                        "msg": req.params.room_id + " Room info",
                        "time": time,
                        "data": room
                    })
                }
            }
        })
}

function deleteRoom(req, res, next) {
    let time = Date.now();
    let roomId = req.params.room_id;

    roomSchema.findByIdAndUpdate(roomId,
        {$pull: {memberIds: req.session._id}}, {new: true}, function(err, room) {
        if(err) {
            console.log(time + " DELETE /:uid/room/:room_id ERROR: Room Delete ERR => " + err);
            res.status(500).json({
                "success": false,
                "msg": "Room Delete ERR",
                "time": time
            })
        } else {
            if(room == null) {
                console.log(time + " DELETE /:uid/room/:room_id ERROR: Room doesn't exist");
                res.status(400).json({
                    "success": false,
                    "msg": "Room doesn't exist",
                    "time": time
                })
            } else {
                console.log(time + " DELETE /:uid/room/:room_id User exit room.: User: ", req.session.uid);
                if(room.memberIds.length === 0) {   // room에 아무도 존재하지 않는다면 room remove
                    room.remove();
                    console.log(time + " DELETE /:uid/room/:room_id Room Deleted");
                }
                res.json({
                    "success": true,
                    "msg": "User Exit Room success",
                    "time": time
                })
            }
        }
    })
}

module.exports = router;