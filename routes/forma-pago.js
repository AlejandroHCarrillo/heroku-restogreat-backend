PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Formapago = require("../models/forma-pago");

// ==========================================================
// Obtener todas las formaspago
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Formapago.find({}, "nombre clave ")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, formaspago) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las formaspago",
          errors: err
        });
      }

      Formapago.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          formaspago: formaspago,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Formapago por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Formapago.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, formapago) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar formapago",
          errors: err
        });
      }
      if (!formapago) {
        return res.status(400).json({
          ok: false,
          mensaje: "La forma de pago con el id " + id + "no existe",
          errors: { message: "No existe una forma de pago con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        formapago: formapago
      });
    });
});

// ==========================================================
// Actualizar Formapago
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Formapago.findById(id, (err, formapago) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar una forma de pago",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!formapago) {
      return res.status(400).json({
        ok: false,
        mensaje: "La forma de pago con el id " + id + " no existe",
        errors: { message: "No existe una forma de pago con ese ID" }
      });
    }

    var body = req.body;

    formapago.nombre = body.nombre;
    formapago.clave = body.clave;
    
    formapago.tipo = body.tipo;
    formapago.comision = body.comision;
    formapago.usuario = req.usuario._id;
    formapago.fechaActualizacion = new Date();

    // Actualizamos la formapago
    formapago.save((err, formapagoGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el forma de pago",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        formapago: formapagoGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva formapago
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var formapago = new Formapago({
    nombre: body.nombre,
    clave : body.clave,
    tipo : body.tipo,
    comision : body.comision,
    
    usuario: req.usuario._id,
    fechaAlta : new Date(),
    fechaActualizacion : new Date()
  });

  formapago.save((err, formapagoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la formapago",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      formapago: formapagoGuardado
    });
  });
});

// ==========================================================
// Eliminar una formapago por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Formapago.findByIdAndDelete(id, (err, formapagoBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar formapago",
        errors: err
      });
    }

    if (!formapagoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la formapago con ese id para ser borrada",
        errors: { message: "Formapago no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      formapago: formapagoBorrado
    });
  });
});

module.exports = app;
