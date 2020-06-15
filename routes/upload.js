var express = require("express");

var fileUpload = require("express-fileupload");
var fs = require("fs");

var app = express();

app.use(fileUpload());

var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");
var Seccion = require("../models/seccion");
var Grupo = require("../models/grupo");
var Producto = require("../models/producto");
var Mesero = require("../models/mesero");
var Areaventa = require("../models/areaventa");

app.put("/:tipo/:id", (req, res) => {  
  var tipo = req.params.tipo;
  var id = req.params.id;
  //  Validar archvios recibidos
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No hay archivos seleccionados",
      errors: { message: "Debe seleccionar un archivo" }
    });
  }

  // Obtener el nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split(".");
  var extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Verifica el tipo de imagenes
  var coleccionesValidas = ["hospitales", "medicos", "usuarios", "secciones", "grupos", "productos", "meseros", "areasventa"];
  if (coleccionesValidas.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El tipo de coleccion de imagen no es valido",
      errors: {
        message:
          "Debe seleccionar un tipo de coleccion valida " +
          coleccionesValidas.join(", ")
      }
    });
  }

  // Verifica extensiones Validas
  var extensionesValidas = ["png", "jpg", "gif", "jpeg"];  
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "El archivo seleccionado no tiene una extension valida",
      errors: {
        message:
          "Debe seleccionar un archivo con las extensiones " +
          extensionesValidas.join(", ")
      }
    });
  }

  // standarizamos el nombre
  // IDusuario-numeroRandom.ext
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;  
  //   Mover archivo a la carpeta adecuada
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error moviendo el archivo",
        errors: err
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);

  });
});

function borrarImagenAnterior(tipo, imgAnterior){
  var pathViejo = `./uploads/${tipo}/${imgAnterior}`;
  if (fs.existsSync(pathViejo)) {
    fs.unlink(pathViejo);
  }
}

function subirImagenUsuario(id, tipo, res){

  Usuario.findById(id, (err, usuario) => {
    if (!usuario) {
      return retErr400(res, tipo);
    }

    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, usuario.img);

    usuario.img = nombreArchivo;
    usuario.save((err, usuarioActualizado) => {
      if (err) {
        return retErr500(res, tipo, err);
      }
      usuarioActualizado.password = ":S";

      return retOK200(res, tipo, usuarioActualizado);
    });
  });
}

function subirImagenMedico(id, tipo, res){

  Medico.findById(id, (err, medico) => {
    if (!medico) {
      return retErr400(res, tipo);
    }
    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, medico.img);

    medico.img = nombreArchivo;
    medico.save((err, medicoActualizado) => {
      if (err) {
        return retErr500(res, tipo, err);
      }      
      return retOK200(res, tipo, medicoActualizado);
    });
  });
  
}

function subirImagenHospital(id, tipo, res){
  Hospital.findById(id, (err, hospital) => {
    if (!hospital) {
      return retErr400(res, tipo);
    }

    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, hospital.img);

    hospital.img = nombreArchivo;

    hospital.save((err, hospitalActualizado) => {
      if (err) {
        return retErr500(res, tipo, err);
      }      
      return retOK200(res, tipo, hospitalActualizado);
    });
  });  
}

function subirImagenSeccion(id, tipo, nombreArchivo, res){
  Seccion.findById(id, (err, seccion) => {
    if (!seccion) {
      return retErr400(res, tipo);
    }

    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, seccion.img);

    seccion.img = nombreArchivo;

    seccion.save((err, dataActualizada) => {
      if (err) {
        return retErr500(res, tipo, err);
      }      
      return retOK200(res, tipo, dataActualizada);
    });
  });  
}

function subirImagenGrupo(id, tipo, nombreArchivo, res){
  Grupo.findById(id, (err, grupo) => {
    if (!grupo) {
      return retErr400(res, tipo);
    }

    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, grupo.img);

    grupo.img = nombreArchivo;

    grupo.save((err, dataActualizada) => {
      if (err) {
        return retErr500 (res, tipo, err);
      }      
      return retOK200(res, tipo, dataActualizada); 
    });
  });  
}

function subirImagenProducto(id, tipo, nombreArchivo, res){
  Producto.findById(id, (err, producto) => {
    if (!producto) {
      return retErr400(res, tipo);
    }

    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, producto.img);

    producto.img = nombreArchivo;

    producto.save((err, dataActualizada) => {
      if (err) {
        return retErr500 (res, tipo, err);
      }      
      return retOK200(res, tipo, dataActualizada); 
    });
  });  
}

function subirImagenMesero(id, tipo, nombreArchivo, res){
  Mesero.findById(id, (err, mesero) => {
    if (!mesero) {
      return retErr400(res, tipo);
    }

    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, mesero.img);

    mesero.img = nombreArchivo;

    mesero.save((err, dataActualizada) => {
      if (err) {
        return retErr500 (res, tipo, err);
      }      
      return retOK200(res, tipo, dataActualizada); 
    });
  });  
}

function subirImagenAreaventa(id, tipo, nombreArchivo, res){
  Areaventa.findById(id, (err, areaventa) => {
    if (!areaventa) {
      return retErr400(res, tipo);
    }

    // Localizamos y borramos la imagen anterior
    borrarImagenAnterior(tipo, areaventa.img);

    areaventa.img = nombreArchivo;

    areaventa.save((err, dataActualizada) => {
      if (err) {
        return retErr500 (res, tipo, err);
      }      
      return retOK200(res, tipo, dataActualizada); 
    });
  });  
}


function retOK200 (res, tipo, data){
  return res.status(200).json({
    ok: true,
    mensaje: `Imagen (${tipo}) actualizada con exito.`,
    data: data
  });
}

function retErr400(res, tipo){
  return res.status(400).json({
    ok: false,
    mensaje: `Elemento (${tipo}) no encontrado.`,
    errors: { message: `Elemento (${tipo}) buscado no existe.`}
  });
}

function retErr500 (res, tipo, err){
  return res.status(500).json({
    ok: false,
    mensaje: `Error actualizando la imagen (${tipo}).`,
    errors: err
  });
}

function subirPorTipo(tipo, id, nombreArchivo, res) {

  if (tipo === "usuarios") {
    subirImagenUsuario(id, tipo, nombreArchivo, res);
  }

  if (tipo === "medicos") {
    subirImagenMedico(id, tipo, nombreArchivo, res);
  }

  if (tipo === "hospitales") {
    subirImagenHospital(id, tipo, nombreArchivo, res);
  }

  if (tipo === "secciones") {
    subirImagenSeccion(id, tipo, nombreArchivo, res);
  }

  if (tipo === "grupos") {
    subirImagenGrupo(id, tipo, nombreArchivo, res);
  }

  if (tipo === "productos") {
    subirImagenProducto(id, tipo, nombreArchivo, res);
  }

  if (tipo === "meseros") {
    subirImagenMesero(id, tipo, nombreArchivo, res);
  }
  
  if (tipo === "areasventa") {
    subirImagenAreaventa(id, tipo, nombreArchivo, res);
  }

}

module.exports = app;
