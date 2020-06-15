PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Rubro = require("../models/rubro");

// ==========================================================
// Obtener todas las rubros
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Rubro.find({}, "nombre clave seccion")
  .populate("seccion", "")
  .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, rubros) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las rubros",
          errors: err
        });
      }

      Rubro.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          rubros: rubros,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Rubro por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Rubro.findById(id)
    .populate("seccion", "")
    .populate("usuario", "nombre img email")
    .exec((err, rubro) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar rubro",
          errors: err
        });
      }
      if (!rubro) {
        return res.status(400).json({
          ok: false,
          mensaje: "La rubro con el id " + id + "no existe",
          errors: { message: "No existe un rubro con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        rubro: rubro
      });
    });
});

// ==========================================================
// Actualizar Rubro
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Rubro.findById(id, (err, rubro) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un rubro",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!rubro) {
      return res.status(400).json({
        ok: false,
        mensaje: "El rubro con el id " + id + " no existe",
        errors: { message: "No existe un rubro con ese ID" }
      });
    }

    var body = req.body;

    rubro.nombre = body.nombre;
    rubro.clave = body.clave;
    rubro.seccion = body.seccion;

    rubro.usuario = req.usuario._id;
    rubro.fechaActualizacion = new Date();

    // Actualizamos la rubro
    rubro.save((err, rubroGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el rubro",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        rubro: rubroGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva rubro
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var rubro = new Rubro({
    nombre: body.nombre,
    clave : body.clave,
    seccion : body.seccion,

    usuario : req.usuario._id,
    fechaAlta : new Date()
  });

  rubro.save((err, rubroGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la rubro",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      rubro: rubroGuardado
    });
  });
});

// ==========================================================
// Eliminar una rubro por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Rubro.findByIdAndDelete(id, (err, rubroBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar rubro",
        errors: err
      });
    }

    if (!rubroBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la rubro con ese id para ser borrada",
        errors: { message: "Rubro no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      rubro: rubroBorrado
    });
  });
});

module.exports = app;
