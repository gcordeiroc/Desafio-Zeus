const routes = require('express').Router();


/* Language setter */
routes.use(require('../utils/acceptLanguage'));


/*
    Routes subgroups
*/
routes.use('/auth', require('./auth'));
routes.use('/users', require('./users'));
routes.use('/files', require('./files'));
routes.use('/purchases', require('./purchases'))


module.exports = routes;