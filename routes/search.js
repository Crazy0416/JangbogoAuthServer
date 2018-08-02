'use strict';
// my Environment Variable
const myEnv = require("../config/environment");

const roomSchema = require('../models/room');
const memberSchema = require('../models/member');

const express = require('express');
const router = express.Router();

// router
router.get('/room', roomSearch);



// router handler
function roomSearch(req, res, next) {
    let filterArray = req.query.filter;
    if (!filterArray)
        filterArray = [];
    else if (typeof filterArray === "string")
        filterArray = [filterArray];
    console.log(filterArray);
    memberSchema.findById(req.session._id).exec()
        .then((memberObj) => {
            if(memberObj == null) {
                let userAddress = req.body.address.split(' ', 2).join(' ');
                console.log('find address: ', userAddress);
            } else {
                let userAddress = memberObj.address.split(' ', 2).join(' ');
                console.log('find address: ', userAddress);
            }
            roomSchema.find({address: {$regex: ".*" + userAddress + ".*"}})
                .populate({
                    path: 'memberIds',
                    model: 'member'
                })
                .exec()
                .then((roomArr) => {
                    let sendArr = [];

                    for(let i = 0; i < roomArr.length; i++) {
                        for(let k = 0; k < filterArray.length; k++) {
                            if(roomArr[i].shoppingType.indexOf(filterArray[k]) !== -1) {
                                for(let t = 0; t < roomArr[i].memberIds.length; t++) {
                                    roomArr[i].memberIds[t].shoppingType = undefined;
                                    roomArr[i].memberIds[t]._id = undefined;
                                    roomArr[i].memberIds[t].shoppingType = undefined;
                                    roomArr[i].memberIds[t].roomIds = undefined;
                                    roomArr[i].memberIds[t].password = undefined;
                                    roomArr[i].memberIds[t].address = undefined;
                                    roomArr[i].memberIds[t].admin = undefined;
                                    roomArr[i].memberIds[t].salt = undefined;
                                    roomArr[i].memberIds[t].createOn = undefined;
                                    roomArr[i].memberIds[t].__v = undefined;
                                    roomArr[i].memberIds[t].age = undefined;
                                    roomArr[i].memberIds[t].gender = undefined;
                                }

                                sendArr.push(roomArr[i]);
                                break;
                            }
                        }
                    }

                    res.json({
                        "success": true,
                        "msg": "User's Recommand Room list",
                        "time": new Date(),
                        "data": sendArr
                    })
                })
                .catch((errRF) => {
                    console.log(new Date() + " -- GET /search/room Room Find ERR=> ", errRF);
                    res.status(500).json({
                        "success": false,
                        "msg": "Room Find Error",
                        "time": new Date()
                    })
                })
        })
        .catch((errF) => {
            console.log(new Date() + " -- GET /search/room User Find ERR=> ", errF);
            res.status(500).json({
                "success": false,
                "msg": "User Find Error",
                "time": new Date()
            })
        });
}

module.exports = router;