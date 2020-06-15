PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Factura = require("../models/factura");

// ==========================================================
// Obtener todas las facturas
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Factura.find({}, "nombre ")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, facturas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las facturas",
          errors: err
        });
      }

      Factura.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          facturas: facturas,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Factura por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Factura.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, factura) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar factura",
          errors: err
        });
      }
      if (!factura) {
        return res.status(400).json({
          ok: false,
          mensaje: "La factura con el id " + id + "no existe",
          errors: { message: "No existe un factura con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        factura: factura
      });
    });
});

// ==========================================================
// Actualizar Factura
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Factura.findById(id, (err, factura) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un factura",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!factura) {
      return res.status(400).json({
        ok: false,
        mensaje: "El factura con el id " + id + " no existe",
        errors: { message: "No existe un factura con ese ID" }
      });
    }

    var body = req.body;

    factura.nombre = body.nombre;
    factura.usuario = req.usuario._id;
    factura.clave = body.clave;

    // Actualizamos la factura
    factura.save((err, facturaGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el factura",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        factura: facturaGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva factura
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var factura = new Factura({
    nombre: body.nombre,
    usuario: req.usuario._id,
    clave : body.clave
  });

  factura.save((err, facturaGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la factura",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      factura: facturaGuardado
    });
  });
});

// ==========================================================
// Eliminar una factura por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Factura.findByIdAndDelete(id, (err, facturaBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar factura",
        errors: err
      });
    }

    if (!facturaBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la factura con ese id para ser borrada",
        errors: { message: "Factura no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      factura: facturaBorrado
    });
  });
});

module.exports = app;
