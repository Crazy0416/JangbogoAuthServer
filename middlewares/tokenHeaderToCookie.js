module.exports = function (req, res, next) {
    if(req.headers["jangtoken"]) {
        if(!req.cookies) {
            req.cookies = {};
        }
        req.cookies.token = req.headers["jangtoken"];
        console.log("cookies: ", req.cookies);

        next();
    } else {
        console.log("headers token: ", req.headers);
        next();
    }
};