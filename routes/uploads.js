const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen } = require('../controllers/uploads');
const { validarCampos, validarArchivo } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');
const router = Router();


router.post('/', [ validarArchivo, validarCampos ], cargarArchivo );

router.put('/:coleccion/:id',[
    validarArchivo,
    check('id', 'No es un ID válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagen );


 
module.exports = router;