PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var AreaVenta = require("../models/areaventa");

// ==========================================================
// Obtener todas las areasventa
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  AreaVenta.find({}, "nombre clave mesainicio mesafin cargoservicio img")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, areasventa) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las areasventa",
          errors: err
        });
      }

      AreaVenta.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          areasventa: areasventa,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener AreaVenta por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  AreaVenta.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, areaventa) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar areaventa",
          errors: err
        });
      }
      if (!areaventa) {
        return res.status(400).json({
          ok: false,
          mensaje: "La areaventa con el id " + id + "no existe",
          errors: { message: "No existe un areaventa con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        areaventa: areaventa
      });
    });
});

// ==========================================================
// Actualizar AreaVenta
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  AreaVenta.findById(id, (err, areaventa) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un areaventa",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!areaventa) {
      return res.status(400).json({
        ok: false,
        mensaje: "El areaventa con el id " + id + " no existe",
        errors: { message: "No existe un areaventa con ese ID" }
      });
    }

    var body = req.body;

    areaventa.clave = body.clave;
    areaventa.nombre = body.nombre;
    areaventa.mesainicio = body.mesainicio;
    areaventa.mesafin = body.mesafin;
    areaventa.cargoservicio = body.cargoservicio;

    areaventa.usuario = req.usuario._id;
    areaventa.fechaActualizacion = new Date();

    // Actualizamos la areaventa
    areaventa.save((err, areaventaGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el areaventa",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        areaventa: areaventaGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva areaventa
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var areaventa = new AreaVenta({
    
    clave :  body.clave,
    nombre :  body.nombre,
    mesainicio :  body.mesainicio,
    mesafin :  body.mesafin,
    cargoservicio :  body.cargoservicio,
    
    usuario: req.usuario._id,
    fechaActualizacion : new Date()
  });

  areaventa.save((err, areaventaGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la areaventa",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      areaventa: areaventaGuardado
    });
  });
});

// ==========================================================
// Eliminar una areaventa por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  AreaVenta.findByIdAndDelete(id, (err, areaventaBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar areaventa",
        errors: err
      });
    }

    if (!areaventaBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la areaventa con ese id para ser borrada",
        errors: { message: "AreaVenta no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      areaventa: areaventaBorrado
    });
  });
});

module.exports = app;
