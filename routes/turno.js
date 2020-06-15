PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Turno = require("../models/turno");

// ==========================================================
// Obtener todas las turnos
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Turno.find({}, "fecha numero mesero fondocaja")
    .populate("usuario", "nombre")
    .populate("mesero", "nombre apaterno amaterno")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, turnos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las turnos",
          errors: err
        });
      }

      Turno.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          turnos: turnos,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Turno por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Turno.findById(id)
    .populate("usuario", "nombre")
    .populate("mesero", "nombre apaterno amaterno nivel")
    .exec((err, turno) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar turno",
          errors: err
        });
      }
      if (!turno) {
        return res.status(400).json({
          ok: false,
          mensaje: "El turno con el id " + id + "no existe",
          errors: { message: "No existe un turno con ese ID" }
        });
      }      
      
      res.status(200).json({
        ok: true,
        turno: turno
      });
    });
});

// ==========================================================
// Actualizar Turno
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Turno.findById(id, (err, turno) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un turno",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!turno) {
      return res.status(400).json({
        ok: false,
        mensaje: "El turno con el id " + id + " no existe",
        errors: { message: "No existe un turno con ese ID" }
      });
    }

    var body = req.body;

    turno.fecha = body.fecha;
    turno.numero = body.numero;
    turno.mesero = body.mesero;
    turno.fondocaja = body.fondocaja;
    
    turno.usuario = req.usuario._id;
    turno.fechaActualizacion = new Date();

    // Actualizamos la turno
    turno.save((err, turnoGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el turno",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        turno: turnoGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva turno
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var turno = new Turno({
    fecha : body.turno.fecha,
    numero : body.turno.numero,
    mesero : body.turno.mesero,
    fondocaja : body.turno.fondocaja,

    usuario: req.usuario._id,
    fechaAlta: new Date()
  });

  turno.save((err, turnoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la turno",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      turno: turnoGuardado
    });
  });
});

// ==========================================================
// Eliminar una turno por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Turno.findByIdAndDelete(id, (err, turnoBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar turno",
        errors: err
      });
    }

    if (!turnoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el turno con ese id para ser borrada",
        errors: { message: "Turno no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      turno: turnoBorrado
    });
  });
});

module.exports = app;
