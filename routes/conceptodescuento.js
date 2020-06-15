PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Conceptodescuento = require("../models/conceptodescuento");

// ==========================================================
// Obtener todas los Conceptos de descuento
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Conceptodescuento.find({}, "nombre clave")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, conceptosdescuento) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando los Conceptos de descuento",
          errors: err
        });
      }

      Conceptodescuento.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          conceptosdescuento: conceptosdescuento,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Conceptodescuento por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Conceptodescuento.findById(id)
    .populate("usuario", "nombre")
    .exec((err, conceptodescuento) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar conceptodescuento",
          errors: err
        });
      }
      if (!conceptodescuento) {
        return res.status(400).json({
          ok: false,
          mensaje: "La conceptodescuento con el id " + id + "no existe",
          errors: { message: "No existe un conceptodescuento con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        conceptodescuento: conceptodescuento
      });
    });
});

// ==========================================================
// Actualizar Conceptodescuento
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Conceptodescuento.findById(id, (err, conceptodescuento) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un conceptodescuento",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!conceptodescuento) {
      return res.status(400).json({
        ok: false,
        mensaje: "El conceptodescuento con el id " + id + " no existe",
        errors: { message: "No existe un conceptodescuento con ese ID" }
      });
    }

    var body = req.body;

    conceptodescuento.nombre = body.nombre;
    conceptodescuento.usuario = req.usuario._id;
    conceptodescuento.clave = body.clave;

    // Actualizamos la conceptodescuento
    conceptodescuento.save((err, conceptodescuentoGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el conceptodescuento",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        conceptodescuento: conceptodescuentoGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva conceptodescuento
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var conceptodescuento = new Conceptodescuento({
    nombre: body.nombre,
    usuario: req.usuario._id,
    clave : body.clave
  });

  conceptodescuento.save((err, conceptodescuentoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la conceptodescuento",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      conceptodescuento: conceptodescuentoGuardado
    });
  });
});

// ==========================================================
// Eliminar una conceptodescuento por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Conceptodescuento.findByIdAndDelete(id, (err, conceptodescuentoBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar conceptodescuento",
        errors: err
      });
    }

    if (!conceptodescuentoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la conceptodescuento con ese id para ser borrada",
        errors: { message: "Conceptodescuento no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      conceptodescuento: conceptodescuentoBorrado
    });
  });
});

module.exports = app;
