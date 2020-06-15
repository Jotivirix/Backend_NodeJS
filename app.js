'use strict'

//Cargar modulos de NodeJS para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar Express para trabajar con HTTP
var app = express();

//Cargar ficheros y rutas
var articlesRoutes = require('./routes/articleRoutes');

//Cargar Middlewares (Se ejecutan antes de las rutas o archivos)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Activar el CORS (Permitiendo peticiones desde el FRONT END)
//Acceso cruzado entre dominios, para permitir llamadas desde el frontend
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas
app.use('/api',articlesRoutes)

//Exportar el modulo --> fichero actual Para cargar este app.js en index.js
module.exports = app;