const { response, request } = require('express');
const { Producto } = require('../models');

const findAll = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    try{

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                      .populate('usuario', 'nombre')
                      .populate('categoria', 'nombre')
                      .skip( Number( desde ) )
                      .limit( Number( limite ) )
        ]);

        const data = {
            total,
            productos
        }

        res.status(200).json(data);

    } catch(e){
        console.log(e);
        res.status(500).json({
            msg:'Error interno del servidor'
        });

    }
}

const findOne = async(req = request, res = response) => {

    const { id } = req.params;

    try{
        const producto = await Producto.findById(id)
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');
    
        res.status(200).json(producto);

    } catch(e){
        console.log(e);
        res.status(500).json({
            msg:'Error interno del servidor'
        });
    }

}

const create = async(req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    try {

        const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

        if(productoDB){
            return res.status(400).json({
                msg: `El producto ${ productoDB.nombre }, ya existe`
            }); 
        }

        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id,
        }

        const producto = new Producto(data);

        await producto.save();

        res.status(200).json(producto);

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
    
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    try{
       const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

       res.status(200).json({
         producto
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

    try {
       const producto = await Producto.findByIdAndUpdate(id, query, { new: true });

       res.status(200).json({
         producto
       });

    } catch(e){
        console.log(e);
        res.status(500).json({
            msg:'Error interno del servidor'
        });
    }
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    deleteOne
}