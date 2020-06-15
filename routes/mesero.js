PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var ObjectId = require('mongoose').Types.ObjectId; 
var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Usuario = require("../models/usuario");
var Mesero = require("../models/mesero");

// ==========================================================
// Obtener todos los meseros
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Mesero.find({}, "")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, meseros) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando los meseros",
          errors: err
        });
      }

      Mesero.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          meseros: meseros,
          total: conteo
        });
      });
    });
});

// ==========================================================
// Obtener lista de meseros con filtro
// ==========================================================
app.get("/lista/:filtro", (req, res, next) => {  
  var filtro = req.params.filtro;
  var posIgual = filtro.indexOf("=");
  var regexp = new RegExp(filtro.substring(posIgual+1, filtro.length), "i");
  
  Mesero.find({ "nombre": regexp }, "nombre apaterno amaterno nombrecorto nivel")
    .exec((err, meseros) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando los meseros",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        meseros: meseros,
        filtro: filtro.substring(posIgual+1, filtro.length),
        total: meseros.length
      });
    });
});

// ==========================================================
// Obtener los cajeros
// ==========================================================
app.get("/cajeros", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Mesero.find({ "nivel": 5 }, "nombre apaterno amaterno")
    // .populate("usuario", "nombre email")
    // .skip(desde)
    // .limit(PAGESIZE)
    .exec((err, meseros) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando los cajeros",
          errors: err
        });
      }

      Mesero.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          meseros: meseros,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Mesero por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Mesero.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, mesero) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar el mesero",
          errors: err
        });
      }
      if (!mesero) {
        return res.status(400).json({
          ok: false,
          mensaje: "El mesero con el id " + id + "no existe",
          errors: { message: "No existe un mesero con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        mesero: mesero
      });
    });
});

// ==========================================
// Obtener Mesero por Usuario ID
// ==========================================
app.get("/usuario/:id", (req, res) => {
  var id = req.params.id;
  Usuario.findById(id)
    .exec((err, usuario) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar el usuario",
          errors: err
        });
      }
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el id " + id + "no existe",
          errors: { message: "No existe un usuario con ese ID" }
        });
      }

      // Mesero.find({ "nivel": 5 }, "nombre apaterno amaterno")
      var query = { user: new ObjectId(usuario._id) };

      Mesero.find(query, "")
        // .populate("usuario", "nombre img email")
        .exec((err, mesero) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar el mesero",
              errors: err
            });
          }
          if (!mesero) {
            return res.status(400).json({
              ok: false,
              mensaje: "El mesero con el id " + id + "no existe",
              errors: { message: "No existe un mesero con ese ID" }
            });
          }

          res.status(200).json({
            ok: true,
            mesero: mesero
          });
        });
    });
});

// ==========================================================
// Actualizar Mesero
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Mesero.findById(id, (err, mesero) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un mesero",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!mesero) {
      return res.status(400).json({
        ok: false,
        mensaje: "El mesero con el id " + id + " no existe",
        errors: { message: "No existe un mesero con ese ID" }
      });
    }

    var body = req.body;

    mesero.numero = body.numero;
    mesero.nombre = body.nombre;
    mesero.apaterno = body.apaterno;
    mesero.amaterno = body.amaterno;
    mesero.nombrecorto = body.nombrecorto;
    mesero.nivel = body.nivel;

    mesero.img = body.img;

    mesero.usuario = req.usuario._id;
    mesero.fechaActualizacion = new Date()

    // Actualizamos la mesero
    mesero.save((err, meseroGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el mesero",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        mesero: meseroGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva mesero
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var mesero = new Mesero({
    numero: body.numero,
    nombre: body.nombre,
    apaterno: body.apaterno,
    amaterno: body.amaterno,
    nombrecorto: body.nombrecorto,
    nivel: body.nivel,

    // password: body.password,
    // img : body.img,
    usuario: req.usuario._id,
    fechaAlta: new Date(),
    fechaActualizacion: new Date()
  });

  mesero.save((err, meseroGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando el mesero",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      mesero: meseroGuardado
    });
  });
});

// ==========================================================
// Eliminar una mesero por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Mesero.findByIdAndDelete(id, (err, meseroBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar el mesero",
        errors: err
      });
    }

    if (!meseroBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el mesero con ese id para ser borrado",
        errors: { message: "Mesero no encontrado con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      mesero: meseroBorrado
    });
  });
});

module.exports = app;
