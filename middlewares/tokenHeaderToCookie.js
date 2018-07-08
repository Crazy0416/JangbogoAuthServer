module.exports = function (req, res, next) {
    if(req.header("token")) {
        if(!req.cookies) {
           req.cookies = {};
        }
        req.cookies.token = req.header("token");

        next();
    } else {
        next();
    }
};