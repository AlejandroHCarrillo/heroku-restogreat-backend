PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Cuenta = require("../models/cuenta");

// ==========================================================
// Obtener todas las cuentas
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Cuenta.find({}, "consecutivo fecha numeromesa numerocomensales mesero estatus")
    .populate("usuario", "nombre")
    .populate("mesero", "nombre apaterno amaterno")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, cuentas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las cuentas",
          errors: err
        });
      }

      Cuenta.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          cuentas: cuentas,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Cuenta por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Cuenta.findById(id)
    .populate("usuario", "nombre ")
    .populate("mesero", "nombre apaterno amaterno")
    .exec((err, cuenta) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar cuenta",
          errors: err
        });
      }
      if (!cuenta) {
        return res.status(400).json({
          ok: false,
          mensaje: "La cuenta con el id " + id + "no existe",
          errors: { message: "No existe un cuenta con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        cuenta: cuenta
      });
    });
});

// ==========================================================
// Actualizar Cuenta
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Cuenta.findById(id, (err, cuenta) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un cuenta",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!cuenta) {
      return res.status(400).json({
        ok: false,
        mensaje: "El cuenta con el id " + id + " no existe",
        errors: { message: "No existe un cuenta con ese ID" }
      });
    }

    var body = req.body;
    cuenta.fecha = body.fecha;
    cuenta.numeromesa = body.numeromesa;
    cuenta.numerocomensales = body.numerocomensales;
    cuenta.mesero = body.mesero;
    cuenta.estatus = body.estatus;

    cuenta.usuario = req.usuario._id;
    cuenta.fechaActualizacion = new Date();

    // Actualizamos la cuenta
    cuenta.save((err, cuentaGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar la cuenta",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        cuenta: cuentaGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva cuenta
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var cuenta = new Cuenta({
      fecha : body.fecha,
      numeromesa : body.numeromesa,
      numerocomensales : body.numerocomensales,
      mesero : body.mesero,
      estatus : body.estatus,

      usuario : req.usuario._id,
      fechaAlta : new Date()
  });

  cuenta.save((err, cuentaGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la cuenta",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      cuenta: cuentaGuardado
    });
  });
});

// ==========================================================
// Eliminar una cuenta por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Cuenta.findByIdAndDelete(id, (err, cuentaBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar cuenta",
        errors: err
      });
    }

    if (!cuentaBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la cuenta con ese id para ser borrada",
        errors: { message: "Cuenta no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      cuenta: cuentaBorrado
    });
  });
});

module.exports = app;
