'use strict';
// my Environment Variable
const myEnv = require("../config/environment");

const express = require('express');
const router = express.Router();

// models
const memberSchema  = require("../models/member");
const addressSchema = require("../models/address");
const roomSchema = require("../models/room");

// router
router.post('/', createRoom);



// router handler
function createRoom(req, res, next) {
    let title = req.body.title;
    let uid = req.session.uid;
    let address = req.body.address;
    let shoppingType = req.body.shoppingType;
    let isDisable = req.body.isDisable;

    memberSchema.findOne({uid: uid}, (errM, memberObj) => {
        if(errM) {

        } else {
            let memberId = memberObj._id;
            addressSchema.findOne({address: address}, (errA, addressObj) => {
                if(errA) {

                } else {
                    let addressId = addressObj._id;

                    roomSchema.create(
                        {title: title},
                        {$push:{memberIds:memberId}},
                        {shoppingType: shoppingType},
                        {address: addressId},
                        {isDisable: isDisable}
                        , (errR, room) => {
                            if (errR) {

                            } else {

                            }
                        })
                }
            })
        }
    })
}


module.exports = router;