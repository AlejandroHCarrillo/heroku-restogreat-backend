PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var ParametroConfiguracion = require("../models/parametro-configuracion");

// ==========================================================
// Obtener todas las parametrosConfiguracion
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  ParametroConfiguracion.find({}, "nombre ")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, parametrosConfiguracion) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las parametrosConfiguracion",
          errors: err
        });
      }

      ParametroConfiguracion.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          parametrosConfiguracion: parametrosConfiguracion,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener ParametroConfiguracion por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  ParametroConfiguracion.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, parametroConfiguracion) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar parametroConfiguracion",
          errors: err
        });
      }
      if (!parametroConfiguracion) {
        return res.status(400).json({
          ok: false,
          mensaje: "La parametroConfiguracion con el id " + id + "no existe",
          errors: { message: "No existe un parametroConfiguracion con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        parametroConfiguracion: parametroConfiguracion
      });
    });
});

// ==========================================================
// Actualizar ParametroConfiguracion
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  ParametroConfiguracion.findById(id, (err, parametroConfiguracion) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un parametroConfiguracion",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!parametroConfiguracion) {
      return res.status(400).json({
        ok: false,
        mensaje: "El parametroConfiguracion con el id " + id + " no existe",
        errors: { message: "No existe un parametroConfiguracion con ese ID" }
      });
    }

    var body = req.body;

    parametroConfiguracion.nombre = body.nombre;
    parametroConfiguracion.usuario = req.usuario._id;
    parametroConfiguracion.clave = body.clave;

    // Actualizamos la parametroConfiguracion
    parametroConfiguracion.save((err, parametroConfiguracionGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el parametroConfiguracion",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        parametroConfiguracion: parametroConfiguracionGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva parametroConfiguracion
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var parametroConfiguracion = new ParametroConfiguracion({
    nombre: body.nombre,
    usuario: req.usuario._id,
    clave : body.clave
  });

  parametroConfiguracion.save((err, parametroConfiguracionGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la parametroConfiguracion",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      parametroConfiguracion: parametroConfiguracionGuardado
    });
  });
});

// ==========================================================
// Eliminar una parametroConfiguracion por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  ParametroConfiguracion.findByIdAndDelete(id, (err, parametroConfiguracionBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar parametroConfiguracion",
        errors: err
      });
    }

    if (!parametroConfiguracionBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la parametroConfiguracion con ese id para ser borrada",
        errors: { message: "ParametroConfiguracion no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      parametroConfiguracion: parametroConfiguracionBorrado
    });
  });
});

module.exports = app;
