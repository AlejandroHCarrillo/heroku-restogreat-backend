PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();

var Hospital = require("../models/hospital");

// ==========================================================
// Obtener todos los hospitales
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({}, "nombre img")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando Hospitales",
          errors: err
        });
      }

      Hospital.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Hospital.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, hospital) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar hospital",
          errors: err
        });
      }
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: "El hospital con el id " + id + "no existe",
          errors: { message: "No existe un hospital con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        hospital: hospital
      });
    });
});

// ==========================================================
// Actualizar hospital
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findById(id, (err, hospital) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un hospital",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + " no existe",
        errors: { message: "No existe un hospital con ese ID" }
      });
    }

    var body = req.body;

    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    // Actualizamos al hospital
    hospital.save((err, hospitalGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el hospital",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

// ==========================================================
// Crear un nuevo hospital
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando el Hospital",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});

// ==========================================================
// Eliminar un hospital por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar hospital",
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el hospital con ese id para ser borrado",
        errors: { message: "Hospital no encontrado con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

module.exports = app;
