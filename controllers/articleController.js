//Controlador para el articulo

"use strict";

//Importamos el validator
var validator = require("validator");
var Article = require("../models/articleModel");

//Para trabajar con los ficheros
var filesystem = require("fs");
var path = require("path");

var controller = {
  
  datosPersona: (req, res) => {
    //Recibiendo parametros
    var hola = req.body.hola;

    return res.status(200).send({
      nombre: "Jose Ignacio",
      apellido: "Navas Sanz",
      email: "joignasa@gmail.com",
      hola,
    });
  },
  
  test: (req, res) => {
    return res.status(200).send({
      message: "Soy la accion test de mi controlador de articulos",
    });
  },
  
  // Para guardar un nuevo articulo
  save: (req, res) => {
    //Que es lo que queremos? Los datos que pasa el usuario
    //Recogemos los parametros por post
    var params = req.body;

    //Validamos los datos con validator
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }
    if (validate_title && validate_content) {
      //Esta todo validado, creamos el objeto a guardar
      var article = new Article();

      //Asignamos valores al objeto
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      //Guardamos el objeto de tipo articulo
      article.save((error, articleStored) => {
        if (error || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "Se ha producido un error al guardar el articulo",
          });
        } else {
          return res.status(200).send({
            status: "success",
            article: articleStored,
          });
        }
      });
    } else {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }
  },
  
  //Metodo para obtener todos los articulos. Tambien tenemos la opcion de filtrar los n articulos que queremos
  getArticles: (req, res) => {
    var query = Article.find({});

    var numberOfArticles = req.params.number;

    if (numberOfArticles || numberOfArticles != undefined) {
      query.limit(parseInt(numberOfArticles));
    }

    //Find
    query.sort("-date").exec((error, articles) => {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "Error al obtener los articulos",
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "Articulos no encontrados",
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Se han obtenido todos los articulos",
        articles,
      });
    });
  },
  
  //Obtenemos los datos de un articulo
  getOneArticle: (req, res) => {
    //Obtenemos el ID que pasa el usuario
    var idArticle = req.params.idArticle;

    if (!idArticle || idArticle == null) {
      return res.status(404).send({
        status: "error",
        message: "El articulo con ID: " + idArticle + " no se encuentra",
      });
    }

    //Comprobamos que existe
    Article.findById(idArticle, (error, article) => {
      if (error) {
        //Devolvemos el articulo
        return res.status(500).send({
          status: "error",
          message: "Error al obtener el articulo con ID: " + idArticle,
        });
      }
      //Devolvemos el articulo
      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },
  
  //Actualiza el articulo
  updateArticle: (req, res) => {
    //Obtenemos el ID que pasa el usuario
    var idArticle = req.params.idArticle;

    //Recoger datos por PUT
    var params = req.body;

    //Validar esos datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos para actualizar el articulo",
      });
    }

    //Buscar el articulo
    if (validate_title && validate_content) {
      Article.findOneAndUpdate(
        {
          _id: idArticle,
        },
        params,
        {
          new: true,
        },
        (error, articleUpdated) => {
          if (error) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar el articulo",
            });
          }
          if (!articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "El articulo a actualizar no existe",
            });
          }
          return res.status(200).send({
            status: "success",
            message: "El articulo se ha actualizado correctamente",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(500).send({
        status: "error",
        message: "Error en la validacion de los datos",
      });
    }
  },
  
  //Borrar el articulo
  deleteArticle: (req, res) => {
    //Buscamos el articulo que queremos borrar
    var idArticle = req.params.idArticle;
    Article.findOneAndDelete(
      {
        _id: idArticle,
      },
      (error, articleRemoved) => {
        if (error) {
          return res.status(500).send({
            status: "error",
            message: "Error al borrar el articulo",
          });
        }
        if (!articleRemoved) {
          return res.status(404).send({
            status: "error",
            message: "El articulo no se encuentra en la base de datos",
          });
        }
        return res.status(200).send({
          status: "success",
          message: "El articulo se ha eliminado correctamente",
          article: articleRemoved,
        });
      }
    );
  },
  
  uploadFile: (req, res) => {
    //Comprobamos que llega la imagen
    if (!req.files.file0) {
      return res.status(404).send({
        status: "error",
        message: "No ha cargado ningun fichero",
      });
    }

    //Tenemos el fichero cargado
    var filepath = req.files.file0.path;
    var filesplit = filepath.split("\\");

    // Linux o Mac --> var filesplit = filepath.split('/');

    //Conseguir nombre y extension del fichero
    var filename = filesplit[filesplit.length - 1];
    var type = req.files.file0.type;

    if (
      type.includes("/png") ||
      type.includes("/jpg") ||
      type.includes("/jpeg") ||
      type.includes("/gif")
    ) {
      //La extension de la imagen es compatible, por lo que procedemos a buscar el articulo
      var idArticle = req.params.idArticle;

      Article.findOneAndUpdate(
        {
          _id: idArticle,
        },
        {
          image: filename,
        },
        {
          new: true,
        },
        (error, articleUpdated) => {
          if (error || !articleUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error al cargar la imagen del articulo",
            });
          }
          return res.status(200).send({
            status: "success",
            message: "La imagen se ha cargado correctamente en el articulo",
            articleUpdated: articleUpdated,
          });
        }
      );
    } else {
      filesystem.unlink(filepath, (error) => {
        //Si es una imagen, buscamos el articulo y le asignamos la imagen
        return res.status(404).send({
          status: "error",
          message: "La extension de la imagen no es compatible",
        });
      });
    }
  },
  
  getImage: (req, res) => {
    //Tenemos que buscar la imagen que hemos pasado por parametro
    var image = req.params.image;
    var pathfile = './upload/articles/' + image;

    filesystem.exists(pathfile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathfile));
      }
      else {
        return res.status(500).send({
          status: "error",
          message: "La imagen no existe",
        });
      }
    });
  },
  
  searchArticle: (req, res) => {
    //Obtener el texto que pasa el usuario
    var text = req.params.text;

    //Buscamos en nuestra coleccion de articulos alguno que tenga el texto introducido
    Article.find({
      "$or": [
        { "title": { "$regex": text, "$options": "i" } },
        { "content": { "$regex": text, "$options": "i" } },
      ]
    }).sort([['date', 'descending']]).exec((error, articles) => {
      if (error || !articles) {
        return res.status(404).send({
          status: "error",
          message: "No se encontraron articulos con la cadena introducida"
        });
      }
      return res.status(200).send({
        status: "success",
        articles
      });
    });

  }
  
}; //END Controller

//Exportamos el modulo para poderlo usar fuera
module.exports = controller;
