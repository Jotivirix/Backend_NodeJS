'use strict'

var mongoose = require('mongoose');
var app = require('./app'); //Usamos el app.js como un modulo
var port = 3900; //localhost:3900

mongoose.set('useFindAndModify',false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useNewUrlParser: true})
.then(() => {
    console.log('Conexion correcta');

    //Crear servidor y escuchar peticiones HTTP
    app.listen(port,() => {
        console.log('Servidor corriendo en http://localhost:'+port);
    });
});