const { response, request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const cargarArchivo = async(req = request, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg: 'No hay archivos que subir'
        });
        return;
    }

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

   res.status(200).json({
     id, 
     coleccion
   });

}

module.exports = {
    cargarArchivo,
    actualizarImagen
}