PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Banco = require("../models/banco");

// ==========================================================
// Obtener todas las bancos
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Banco.find({}, "nombre clave")
    .populate("usuario", "nombre")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, bancos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las bancos",
          errors: err
        });
      }

      Banco.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          bancos: bancos,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Banco por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Banco.findById(id)
    .populate("usuario", "nombre")
    .exec((err, banco) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar banco",
          errors: err
        });
      }
      if (!banco) {
        return res.status(400).json({
          ok: false,
          mensaje: "La banco con el id " + id + "no existe",
          errors: { message: "No existe un banco con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        banco: banco
      });
    });
});

// ==========================================================
// Actualizar Banco
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Banco.findById(id, (err, banco) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un banco",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!banco) {
      return res.status(400).json({
        ok: false,
        mensaje: "El banco con el id " + id + " no existe",
        errors: { message: "No existe un banco con ese ID" }
      });
    }

    var body = req.body;

    banco.nombre = body.nombre;
    banco.clave = body.clave;

    banco.usuario = req.usuario._id;
    banco.fechaActualizacion = new Date();

    // Actualizamos la banco
    banco.save((err, bancoGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el banco",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        banco: bancoGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva banco
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var banco = new Banco({
    nombre: body.nombre,
    clave : body.clave,

    usuario: req.usuario._id,
    fechaAlta: new Date()
  });

  banco.save((err, bancoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la banco",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      banco: bancoGuardado
    });
  });
});

// ==========================================================
// Eliminar una banco por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Banco.findByIdAndDelete(id, (err, bancoBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar banco",
        errors: err
      });
    }

    if (!bancoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la banco con ese id para ser borrada",
        errors: { message: "Banco no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      banco: bancoBorrado
    });
  });
});

module.exports = app;
