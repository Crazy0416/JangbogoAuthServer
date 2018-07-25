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
                console.log(new Date() + " -- GET /search/room User doesn't exist.");
                res.status(500).json({
                    "success": false,
                    "msg": "User doesn't exist",
                    "time": new Date()
                })
            } else {
                let userAddress = memberObj.address;
                debugger;
                roomSchema.find({address: userAddress}).exec()
                    .then((roomArr) => {
                        let sendArr = [];

                        for(let i = 0; i < roomArr.length; i++) {
                            for(let k = 0; k < filterArray.length; k++) {
                                if(roomArr[i].shoppingType.indexOf(filterArray[k]) !== -1) {
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
            }
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