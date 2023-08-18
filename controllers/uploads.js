const { response, request } = require("express");
const path = require('path');
const fs = require('fs');
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req = request, res = response) => {

    try {
        // const nombre = await subirArchivo(req.files, ["txt", "md"], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.status(200).json({
            nombre
        });

    } catch(msg){
        res.status(400).json({ msg });
    }
}

const actualizarImagen = async(req = request, res = response) => {

   const { id, coleccion } = req.params;

   let modelo;

   switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un usuario con el id ${id}`
            });
        }
    break;

    case 'productos':
        modelo = await Producto.findById(id); 
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un producto con el id ${id}`
            });
        }
        
        break;
   
    default:
        return res.status(500).json({ msg: 'Se me olvidó validar esto' });
   }

   // Limpiar imágenes previas
   if(modelo.img){
     //si existe borramos la imagen del servidor
     const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);

     // ! comprobamos si existe el archivo - si existe lo borramos
     if( fs.existsSync(pathImagen) ){
        fs.unlinkSync( pathImagen );
     }
   }


   const nombre = await subirArchivo(req.files, undefined, coleccion);
   modelo.img = nombre;
   await modelo.save();
    
   res.status(200).json(modelo);

}
 
const mostrarImagen = async(req = request, res = response) => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id); 
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imágenes previas
    if(modelo.img){
        //si existe borramos la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);

        // ! comprobamos si existe el archivo - respondemos la imagen
        if( fs.existsSync(pathImagen) ){
            return res.sendFile( pathImagen );
        }
    }

    // ! si no existe la imagen regresamos una por defecto
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
    // res.status(200).json({
    //     msg: pathImagen
    // });

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}