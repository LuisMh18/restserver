const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol }); 
    if(!existeRol){
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }   
}


const esEmailValido = async(correo = '') => {

    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error(`El email ${ correo } ya está registrado`);
    }

}

const existeUsuarioPorId = async(id) => {

    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id no existe ${ id }`);
    }

}

const existeCategoriaPorId = async(id) => {

    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`El id no existe ${ id }`);
    }

}

const existeProductoPorId = async(id) => {

    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El id no existe ${ id }`);
    }

}


module.exports = {
    esRoleValido,
    esEmailValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}