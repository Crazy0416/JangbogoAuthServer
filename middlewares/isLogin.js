module.exports = function isLogin(req, res, next) {
    if (req.session.uid) {
        res.json({
            "success" : false,
            "msg": "Already login!",
            "time": Date.now()
        })
    } else {
        next();
    }
};