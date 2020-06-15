PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Modificador = require("../models/modificador");

// ==========================================================
// Obtener todos los modificadores
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Modificador.find({}, "nombre clave rubro")
    .populate("usuario", "nombre email")
    .populate("rubro", "nombre clave ")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, modificadores) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando los modificadores",
          errors: err
        });
      }

      Modificador.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          modificadores: modificadores,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Modificador por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Modificador.findById(id)
    .populate("usuario", "nombre img email")
    .populate("rubro", "clave nombre")
    .exec((err, modificador) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar modificador",
          errors: err
        });
      }
      if (!modificador) {
        return res.status(400).json({
          ok: false,
          mensaje: "La modificador con el id " + id + "no existe",
          errors: { message: "No existe un modificador con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        modificador: modificador
      });
    });
});

// ==========================================================
// Actualizar Modificador
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Modificador.findById(id, (err, modificador) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un modificador",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!modificador) {
      return res.status(400).json({
        ok: false,
        mensaje: "El modificador con el id " + id + " no existe",
        errors: { message: "No existe un modificador con ese ID" }
      });
    }

    var body = req.body;

    modificador.nombre = body.nombre;
    modificador.clave = body.clave;
    modificador.rubro = body.rubro;

    modificador.usuario = req.usuario._id;
    modificador.fechaActualizacion = new Date();

    // Actualizamos la modificador
    modificador.save((err, modificadorGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el modificador",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        modificador: modificadorGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva modificador
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var modificador = new Modificador({
    nombre: body.nombre,
    clave: body.clave,
    rubro: body.rubro,

    usuario: req.usuario._id,
    fechaAlta: new Date()
  });

  modificador.save((err, modificadorGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la modificador",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      modificador: modificadorGuardado
    });
  });
});

// ==========================================================
// Eliminar una modificador por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Modificador.findByIdAndDelete(id, (err, modificadorBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar modificador",
        errors: err
      });
    }

    if (!modificadorBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la modificador con ese id para ser borrada",
        errors: { message: "Modificador no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      modificador: modificadorBorrado
    });
  });
});

module.exports = app;
