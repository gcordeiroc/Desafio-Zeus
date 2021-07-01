module.exports = (req, res, next) => {
    res['language'] = req.headers['accept-language'];
    next();
}