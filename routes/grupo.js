PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Grupo = require("../models/grupo");

// ==========================================================
// Obtener todos los grupos
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Grupo.find({}, "nombre clave img seccion")
    .populate("usuario", "nombre email")
    .populate("seccion", "nombre")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, grupos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando los grupos",
          errors: err
        });
      }

      Grupo.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          grupos: grupos,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Grupo por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Grupo.findById(id)
    .populate("usuario", "nombre img email")
    .populate("seccion", "nombre img")
    .exec((err, grupo) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar grupo",
          errors: err
        });
      }
      if (!grupo) {
        return res.status(400).json({
          ok: false,
          mensaje: "El grupo con el id " + id + "no existe",
          errors: { message: "No existe un grupo con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        grupo: grupo
      });
    });
});

// ==========================================================
// Actualizar Grupo
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Grupo.findById(id, (err, grupo) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un grupo",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!grupo) {
      return res.status(400).json({
        ok: false,
        mensaje: "El grupo con el id " + id + " no existe",
        errors: { message: "No existe un grupo con ese ID" }
      });
    }

    var body = req.body;

    grupo.nombre = body.nombre;
    grupo.seccion = body.seccion;
    grupo.img = body.img;
    grupo.usuario = req.usuario._id;
    grupo.clave = body.clave;

    // Actualizamos el grupo
    grupo.save((err, grupoGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el grupo",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        grupo: grupoGuardado
      });
    });
  });
});

// ==========================================================
// Crear un nuevo grupo
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var grupo = new Grupo({
    nombre: body.nombre,
    seccion: body.seccion,
    img: body.img,
    usuario: req.usuario._id,
    clave : body.clave
  });

  grupo.save((err, grupoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando el grupo",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      grupo: grupoGuardado
    });
  });
});

// ==========================================================
// Eliminar una grupo por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Grupo.findByIdAndDelete(id, (err, grupoBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar grupo",
        errors: err
      });
    }

    if (!grupoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el grupo con ese id para ser borrado",
        errors: { message: "Grupo no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      grupo: grupoBorrado
    });
  });
});

module.exports = app;
