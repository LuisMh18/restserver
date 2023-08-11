const { Router } = require('express');
const { findAll, create } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


router.get('/', findAll);
router.post('/', [
    check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').trim().isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], create);


module.exports = router;