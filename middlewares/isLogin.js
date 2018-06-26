function isLogin(req, res, next) {
    if (req.session.uid) {
        res.json({
            "msg": "Already login!"
        })
    } else {
        next();
    }
}