'use strict';
// my Environment Variable
const myEnv = require("../config/environment");

const roomSchema = require('../models/room');
const memberSchema = require('../models/member');
const path = require('path');

const express = require('express');
const router = express.Router();

// router
router.get('/', indexPage);

function indexPage(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
}

module.exports = router;