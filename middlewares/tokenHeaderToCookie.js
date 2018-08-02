module.exports = function (req, res, next) {
    if(req.header("token")) {
        if(!req.cookies) {
           req.cookies = {};
        }
        req.cookies.token = req.header("token");
        console.log("cookies: ", req.cookies);

        next();
    } else {
        next();
    }
};