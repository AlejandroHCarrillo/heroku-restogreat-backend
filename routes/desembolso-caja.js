PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var DesembolsoCaja = require("../models/desembolso-caja");

// ==========================================================
// Obtener todas las DesembolsosCaja
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  DesembolsoCaja.find({}, "nombre ")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, DesembolsosCaja) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las DesembolsosCaja",
          errors: err
        });
      }

      DesembolsoCaja.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          DesembolsosCaja: DesembolsosCaja,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener DesembolsoCaja por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  DesembolsoCaja.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, desembolsocaja) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar desembolsocaja",
          errors: err
        });
      }
      if (!desembolsocaja) {
        return res.status(400).json({
          ok: false,
          mensaje: "La desembolsocaja con el id " + id + "no existe",
          errors: { message: "No existe un desembolsocaja con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        desembolsocaja: desembolsocaja
      });
    });
});

// ==========================================================
// Actualizar DesembolsoCaja
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  DesembolsoCaja.findById(id, (err, desembolsocaja) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un desembolsocaja",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!desembolsocaja) {
      return res.status(400).json({
        ok: false,
        mensaje: "El desembolsocaja con el id " + id + " no existe",
        errors: { message: "No existe un desembolsocaja con ese ID" }
      });
    }

    var body = req.body;

    desembolsocaja.nombre = body.nombre;
    desembolsocaja.usuario = req.usuario._id;
    desembolsocaja.clave = body.clave;

    // Actualizamos la desembolsocaja
    desembolsocaja.save((err, desembolsocajaGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el desembolsocaja",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        desembolsocaja: desembolsocajaGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva desembolsocaja
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var desembolsocaja = new DesembolsoCaja({
    nombre: body.nombre,
    usuario: req.usuario._id,
    clave : body.clave
  });

  desembolsocaja.save((err, desembolsocajaGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la desembolsocaja",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      desembolsocaja: desembolsocajaGuardado
    });
  });
});

// ==========================================================
// Eliminar una desembolsocaja por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  DesembolsoCaja.findByIdAndDelete(id, (err, desembolsocajaBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar desembolsocaja",
        errors: err
      });
    }

    if (!desembolsocajaBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la desembolsocaja con ese id para ser borrada",
        errors: { message: "DesembolsoCaja no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      desembolsocaja: desembolsocajaBorrado
    });
  });
});

module.exports = app;
