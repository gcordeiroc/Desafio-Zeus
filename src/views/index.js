const routes = require('express').Router();


routes.use(require('./users'));
routes.use(require('./files'));
routes.use(require('./purchases'))

module.exports = routes;