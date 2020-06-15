PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var ColaComanda = require("../models/colacomanda");

// ==========================================================
// Obtener todas las colascomandas
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  // console.log(ColaComanda);
  ColaComanda.find({}, "nombre")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, colascomandas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando las colas de comandas",
          errors: err
        });
      }

      ColaComanda.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          colascomandas: colascomandas,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener ColaComanda por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  ColaComanda.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, colacomanda) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar colacomanda",
          errors: err
        });
      }
      if (!colacomanda) {
        return res.status(400).json({
          ok: false,
          mensaje: "La cola de comandas con el id " + id + "no existe",
          errors: { message: "No existe un colacomanda con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        colacomanda: colacomanda
      });
    });
});

// ==========================================================
// Actualizar ColaComanda
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  ColaComanda.findById(id, (err, colacomanda) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar la cola de comandas",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!colacomanda) {
      return res.status(400).json({
        ok: false,
        mensaje: "La cola de comandas con el id " + id + " no existe",
        errors: { message: "No existe una cola de comandas con ese ID" }
      });
    }

    var body = req.body;

    colacomanda.nombre = body.nombre;
    colacomanda.usuario = req.usuario._id;

    // Actualizamos la colacomanda
    colacomanda.save((err, colacomandaGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el cola de comanda",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        colacomanda: colacomandaGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nueva colacomanda
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  console.log('creando cola de impresion de comandas');
  
  var body = req.body;

  var colacomanda = new ColaComanda({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  colacomanda.save((err, colacomandaGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la colacomanda",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      colacomanda: colacomandaGuardado
    });
  });
});

// ==========================================================
// Eliminar una colacomanda por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  ColaComanda.findByIdAndDelete(id, (err, colacomandaBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar colacomanda",
        errors: err
      });
    }

    if (!colacomandaBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la colacomanda con ese id para ser borrada",
        errors: { message: "ColaComanda no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      colacomanda: colacomandaBorrado
    });
  });
});

module.exports = app;
