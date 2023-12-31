const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
// const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares')

const { esRoleValido, esEmailValido, existeUsuarioPorId } = require('../helpers/db-validators');
const { findAll, create, update, deleteOne } = require('../controllers/usuarios');

const router = Router();


router.get('/', findAll);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').trim().isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( esEmailValido ),
    check('rol').custom( esRoleValido ), 
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], create);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], update);


router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], deleteOne);

module.exports = router;