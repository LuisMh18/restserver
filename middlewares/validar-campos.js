const { validationResult } = require("express-validator");


const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    //si el middleware pasa entonces sigue con el siguiente middleware(si ya no hay middleware entonces sigue con el controlador)
    next();

}


module.exports = {
    validarCampos
}