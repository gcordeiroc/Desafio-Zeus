const routes = require('express').Router();

const controller = require('../controllers/purchases');

/* Auth */
routes.use(require('../middlewares/auth'));

routes.post('/', controller.create);
routes.get('/:id', controller.getOne);
routes.get('/', controller.getMany);
routes.put('/:id', controller.update);
routes.delete('/:id', controller.delete);

module.exports = routes;