const routes = require('express').Router();

const userController = require('../controllers/users');

/*
    routes start
*/

routes.post('/', userController.login);


module.exports = routes;