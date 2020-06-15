PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Cortecaja = require("../models/cortecaja");

// ==========================================================
// Obtener todas las Cortescaja
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Cortecaja.find({}, "nombre ")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, Cortescaja) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las Cortescaja",
          errors: err
        });
      }

      Cortecaja.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          Cortescaja: Cortescaja,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Cortecaja por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Cortecaja.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, cortecaja) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar cortecaja",
          errors: err
        });
      }
      if (!cortecaja) {
        return res.status(400).json({
          ok: false,
          mensaje: "La cortecaja con el id " + id + "no existe",
          errors: { message: "No existe un cortecaja con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        cortecaja: cortecaja
      });
    });
});

// ==========================================================
// Actualizar Cortecaja
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Cortecaja.findById(id, (err, cortecaja) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un cortecaja",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!cortecaja) {
      return res.status(400).json({
        ok: false,
        mensaje: "El cortecaja con el id " + id + " no existe",
        errors: { message: "No existe un cortecaja con ese ID" }
      });
    }

    var body = req.body;

    cortecaja.nombre = body.nombre;
    cortecaja.usuario = req.usuario._id;
    cortecaja.clave = body.clave;

    // Actualizamos la cortecaja
    cortecaja.save((err, cortecajaGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el cortecaja",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        cortecaja: cortecajaGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva cortecaja
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var cortecaja = new Cortecaja({
    nombre: body.nombre,
    usuario: req.usuario._id,
    clave : body.clave
  });

  cortecaja.save((err, cortecajaGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la cortecaja",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      cortecaja: cortecajaGuardado
    });
  });
});

// ==========================================================
// Eliminar una cortecaja por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Cortecaja.findByIdAndDelete(id, (err, cortecajaBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar cortecaja",
        errors: err
      });
    }

    if (!cortecajaBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la cortecaja con ese id para ser borrada",
        errors: { message: "Cortecaja no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      cortecaja: cortecajaBorrado
    });
  });
});

module.exports = app;
