PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Seccion = require("../models/seccion");

// ==========================================================
// Obtener todas las secciones
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Seccion.find({}, "nombre clave img")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, secciones) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las secciones",
          errors: err
        });
      }

      Seccion.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          secciones: secciones,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Seccion por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Seccion.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, seccion) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar seccion",
          errors: err
        });
      }
      if (!seccion) {
        return res.status(400).json({
          ok: false,
          mensaje: "La seccion con el id " + id + "no existe",
          errors: { message: "No existe un seccion con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        seccion: seccion
      });
    });
});

// ==========================================================
// Actualizar Seccion
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Seccion.findById(id, (err, seccion) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un seccion",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!seccion) {
      return res.status(400).json({
        ok: false,
        mensaje: "El seccion con el id " + id + " no existe",
        errors: { message: "No existe un seccion con ese ID" }
      });
    }

    var body = req.body;

    seccion.clave = body.clave;
    seccion.nombre = body.nombre;

    seccion.usuario = req.usuario._id;
    seccion.fechaActualizacion = new Date();


    // Actualizamos la seccion
    seccion.save((err, seccionGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el seccion",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        seccion: seccionGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva seccion
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var seccion = new Seccion({
    nombre: body.nombre,
    clave : body.clave,
    usuario: req.usuario._id,
    fechaAlta: new Date()
  });

  seccion.save((err, seccionGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la seccion",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      seccion: seccionGuardado
    });
  });
});

// ==========================================================
// Eliminar una seccion por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Seccion.findByIdAndDelete(id, (err, seccionBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar seccion",
        errors: err
      });
    }

    if (!seccionBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la seccion con ese id para ser borrada",
        errors: { message: "Seccion no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      seccion: seccionBorrado
    });
  });
});

module.exports = app;
