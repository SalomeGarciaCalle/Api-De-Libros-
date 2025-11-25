const express = require('express');
const router = express.Router();
const controller = require('../controllers/libros.controller');

router.get('/', controller.getLibros);
router.get('/:id', controller.getLibroById);
router.post('/', controller.createLibro);
router.put('/:id', controller.updateLibro);
router.delete('/:id', controller.deleteLibro);

module.exports = router;
