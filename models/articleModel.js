//Modelo para los Articulos
//Debemos definir el esquema del articulo, sus propiedades y la estructura que debe tener

'use strict'

//Cargamos mongoose
var mongoose = require('mongoose');

//Definimos el Schema
var schema = mongoose.Schema;

//Creamos el esquema del Articulo
var articleSchema = schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now},
    image: String
});

//Exportar el modelo como un modulo
module.exports = mongoose.model('article',articleSchema);