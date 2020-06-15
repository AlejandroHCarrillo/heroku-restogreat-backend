PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Producto = require("../models/producto");

// ==========================================================
// Obtener todos los productos
// ==========================================================
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({}, "")
    .populate("usuario", "nombre email")
    .populate("grupo", "nombre")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando los productos",
          errors: err
        });
      }

      Producto.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          productos: productos,
          total: conteo
        });
      });
    });
});

// ==========================================
// Obtener Producto por ID
// ==========================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Producto.findById(id)
    .populate("usuario", "nombre img email")
    .populate("grupo", "")
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar producto",
          errors: err
        });
      }
      if (!producto) {
        return res.status(400).json({
          ok: false,
          mensaje: "La producto con el id " + id + "no existe",
          errors: { message: "No existe un producto con ese ID" }
        });
      }
      res.status(200).json({
        ok: true,
        producto: producto
      });
    });
});

// ==========================================================
// Actualizar Producto
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Producto.findById(id, (err, producto) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un producto",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!producto) {
      return res.status(400).json({
        ok: false,
        mensaje: "El producto con el id " + id + " no existe",
        errors: { message: "No existe un producto con ese ID" }
      });
    }

    var body = req.body;

    producto.clave = body.clave;
    producto.grupo = body.grupo;
    producto.nombre = body.nombre;
    producto.nombreCorto = body.nombreCorto;
    producto.descripcion = body.descripcion;
    producto.precio = body.precio;
    producto.tienePrecioAbierto = body.tienePrecioAbierto;
    producto.fechaAlta = Date.now;
    producto.fechaActualizacion = Date.now;
    producto.usuario = req.usuario._id;

    producto.imprimir = req.imprimir;
    producto.colaComandas = req.colaComandas;
    producto.img = req.img;

    // Actualizamos la producto
    producto.save((err, productoGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el producto",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        producto: productoGuardado
      });
    });
  });
});

// ==========================================================
// Crear una nuevo producto
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
  var body = req.body;

  var producto = new Producto({
    clave : body.clave,
    grupo : body.grupo,
    nombre : body.nombre,
    nombreCorto : body.nombreCorto,
    descripcion : body.descripcion,
    clave : body.clave,
    precio : body.precio,
    tienePrecioAbierto : body.tienePrecioAbierto,
    fechaAlta : new Date(),
    fechaActualizacion : new Date(),
    usuario: body.usuario,
    imprimir : body.imprimir,
    colaComandas : body.colaComandas
    // , img : body.img
  });

  producto.save((err, productoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando la producto",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoGuardado
    });
  });
});

// ==========================================================
// Eliminar una producto por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Producto.findByIdAndDelete(id, (err, productoBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar producto",
        errors: err
      });
    }

    if (!productoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe la producto con ese id para ser borrada",
        errors: { message: "Producto no encontrada con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      producto: productoBorrado
    });
  });
});

module.exports = app;
