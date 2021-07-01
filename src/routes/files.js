const routes = require('express').Router();

const controller = require('../controllers/files')


/*
    Routes
*/

routes.get('/:id', controller.getFile);

/* Auth */
routes.use(require('../middlewares/auth'));

routes.delete('/:id', controller.remove);


module.exports = routes;
