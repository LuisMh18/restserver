const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const findAll = async(req = request, res = response) => {
    res.json({
        msg:"get API"
    })
};

const create = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario( { nombre, correo, password, rol } );

    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        return res.status(400).json({
            msg:'Ese correo ya está registrado'
        });
    }

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save();

    res.json({
        msg:"create!",
        usuario
    });

}

module.exports = {
    findAll,
    create
}