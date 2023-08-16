const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // verificr si el usuario existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - estado: false"
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if(!validPassword){
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - password"
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario, 
            token
        });

    } catch(e){
        console.log(e);
        res.status(500).json({
            msg:"Erro interno del servidor"
        });
    }

}


module.exports = {
    login 
}