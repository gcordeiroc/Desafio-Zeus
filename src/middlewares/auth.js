const jwt = require('jsonwebtoken');
const { promisify } = require('util');

/* Secret */
const { SECRET } = process.env;

module.exports = async (req, res, next) => {
    let { authorization } = req.headers;

    if(!authorization) return res.status(401).json({ message: 'Token not provided!' });

    let [, token] = authorization.split(' ');

    try {
        let { id } = await promisify(jwt.verify)(token, SECRET);
        
        if(!id) return res.users.error('unauthorized');

        req.users = { id };

        next();
    } catch (err) { return res.users.error('unauthorized') };
};
