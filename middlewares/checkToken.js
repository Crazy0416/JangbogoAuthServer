module.exports = function(req, res, next) {
    console.log("req.session: ", req.session);
    if(req.session.uid) {
        next()
    } else {
        req.status(403).json({
            success: false,
            msg: "token not exist",
            time: new Date()
        })
    }
};