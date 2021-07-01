const routes = require('express').Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const controller = require('../controllers/users');


/*
    Routes
*/

routes.post('/', upload.single('file'), controller.create);

/* Auth */
routes.use(require('../middlewares/auth'));

routes.get('/:id', controller.getOne);

/* Deactivated for production */
// routes.get('/', controller.getMany);

routes.put('/:id', upload.single('file'), controller.update);
routes.delete('/:id', controller.delete);


module.exports = routes;