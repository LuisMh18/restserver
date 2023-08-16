const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')

const { findAll, findOne, create, update, deleteOne } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', findAll);

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], findOne);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
    validarCampos
], create);

router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], update);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], deleteOne);

module.exports = router;