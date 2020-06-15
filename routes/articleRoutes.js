'use strict'

var express = require('express');

var articleContoller = require('../controllers/articleController');

var router = express.Router();

//Multiparty para subir archivos
var multiparty = require('connect-multiparty');
//Creamos un middleware para hacer que espere antes de entrar en la ruta
var middleware = multiparty({uploadDir: './upload/articles'});

//Rutas de prueba
router.get('/controllerTest',articleContoller.test);    //Ruta por GET que llama a la accion test de articleController
router.post('/controllerDatos',articleContoller.datosPersona);   //Ruta por POST que llama a la accion datosPersona de articleController

//Rutas reales
//Guardar un articulo
router.post('/save',articleContoller.save);
//Obtener determinado numero de articulos
router.get('/articles/:number?',articleContoller.getArticles);
//Obtener los datos de un articulo por su ID
router.get('/article/:idArticle',articleContoller.getOneArticle);
//Actualizar un articulo por su ID
router.put('/article/:idArticle',articleContoller.updateArticle);
//Borrar un articulo por su ID
router.delete('/article/:idArticle', articleContoller.deleteArticle);
//Para subir archivos, necesitamos el middleware para procesarlos
router.post('/upload-img/:idArticle', middleware, articleContoller.uploadFile);
//Obtener la imagen del articulo
router.get('/getArticleImg/:image',articleContoller.getImage);
//Buscando un articulo
router.get('/searchArticle/:text',articleContoller.searchArticle);

//Exportamos el modulo
module.exports = router;