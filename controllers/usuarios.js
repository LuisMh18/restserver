const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const findAll = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    // const usuarios = await Usuario.find(query)
    //         .skip( Number( desde ) )
    //         .limit( Number( limite ) );
    
    // const total = await Usuario.countDocuments(query);

    /*Mandamos un arreglo con todas las promesas que queremos que se ejecuten, es decir para mandar todas las peticiones de 
        manera simultanea y no estar esperando a que se ejecute una y luego se ejecute la otra 
        para eso utilizamos Promise.all() -> va eejcutar ambas consultas de manera simultanea y no va a continuar hasta que ambas funcionen
    */

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        usuarios
    })
};

const create = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save(); 

    res.json({
        usuario
    });

}

const update = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
 
    //TODO validar contra base de datos
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario 
    });
}

const deleteOne = async(req = request, res = response ) => {
    const { id } = req.params;

    //borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    //borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);
}
 
module.exports = {
    findAll,
    create,
    update,
    deleteOne
}