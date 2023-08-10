const { Router } = require('express');
const { findAll } = require('../controllers/usuarios');
const router = Router();


router.get('/', findAll);


module.exports = router;