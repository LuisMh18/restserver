const { Router } = require('express');
const { check } = require('express-validator');
const { create, findAll, findOne, update, deleteOne } = require('../controllers/productos');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();


router.get('/', findAll);

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], findOne);

router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
    check('precio', 'El precio es obligatorio').trim().not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], create);

router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un ID válido').isMongoId(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], update);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], deleteOne);

module.exports = router;