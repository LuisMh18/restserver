
const { request, response } = require('express');
const jwt = require('jsonwebtoken');  
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //obtener usuario autenticado
        const usuario = await Usuario.findById( uid );

        //validamos si el usuario no existe
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido - el usuario no existe'
            });
        }

        //verificar si el uid tiene estado en true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        req.usuario = usuario;


        next();

    } catch(e){
        console.log(e);
        res.status(401).json({
            msg:'Token no válido'
        });
    }

}


module.exports = {
    validarJWT
}