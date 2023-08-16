const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { Categoria } = require('../models');
//const Usuario = require('../models/usuario');


const findAll = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    try{

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                      .populate('usuario', 'nombre')
                      .skip( Number( desde ) )
                      .limit( Number( limite ) )
        ]);

        const data = {
            total,
            categorias
        }

        res.status(200).json(data);

    } catch(e){
        console.log(e);
        res.status(500).json({
            msg:'Error interno del servidor'
        });

    }
    
};

const findOne = async(req = request, res = response) => {

    const { id } = req.params;

    try{
        const categoria = await Categoria.findById(id)
                                .populate('usuario', 'nombre');
    
        res.status(200).json(categoria);

    } catch(e){
        console.log(e);
        res.status(500).json({
            msg:'Error interno del servidor'
        });
    }
};

const create = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    try{

        const categoriaDB = await Categoria.findOne({ nombre });

        if(categoriaDB){
            return res.status(400).json({
                msg: `La categoría ${ categoriaDB.nombre }, ya existe`
            }); 
        }

        const data = {
            nombre,
            usuario: req.usuario._id
        }

        //preparar la data a guardar
        const categoria = new Categoria( data );

        //guardar db
        await categoria.save();

        res.status(201).json(categoria);


        } catch(e){
            console.log(e);
            res.status(500).json({
                msg:'Error interno del servidor'
            });
        }

}

const update = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    try{
       const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
       res.status(200).json({
        categoria
       });

        } catch(e){
            console.log(e);
            res.status(500).json({
                msg:'Error interno del servidor'
            });
        }
    
}

const deleteOne = async(req = request, res = response ) => {
    
    const { id } = req.params;
    const query = { estado: false };

    try{
       const categoria = await Categoria.findByIdAndUpdate(id, query, { new: true });

       res.status(200).json({
        categoria
       });

        } catch(e){
            console.log(e);
            res.status(500).json({
                msg:'Error interno del servidor'
            });
        }
}
 
module.exports = {
    findAll,
    findOne,
    create,
    update,
    deleteOne
}