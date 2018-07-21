module.exports = function isLogin(req, res, next) {
    if (req.session.uid) {
        res.json({
            "success" : false,
            "msg": "이미 로그인되어있습니다.",
            "time": new Date()
        })
    } else {
        next();
    }
};