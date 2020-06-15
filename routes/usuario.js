PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");
var bcrypt = require("bcryptjs");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();

var Usuario = require("../models/usuario");

// ==========================================================
// Obtener todos los usuarios
// ==========================================================
app.get("/", (req, res, next) => {
  // console.log('get usuario...');

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Usuario.find({}, "nombre email img role google")
    .skip(desde)
    .limit(PAGESIZE)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando Usuarios",
          errors: err
        });
      }
      Usuario.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          usuarios: usuarios,
          total: conteo
        });
      });
    });
});

// ==========================================================
// Actualizar usuario
// ==========================================================
app.put("/:id", [mdAutentificacion.verificaToken, mdAutentificacion.verificaADMIN_o_MismoUsuario ], (req, res) => {
  var id = req.params.id;

  Usuario.findById(id, (err, usuario) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un usuario",
        errors: err
      });
    }
    // validar si no hay datos para actualizar
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id " + id + " no existe",
        errors: { message: "No existe un usuario con ese ID" }
      });
    }

    var body = req.body;

    usuario.nombre = body.nombre;
    usuario.apellidoP = body.apellidoP;
    usuario.apellidoM = body.apellidoM;
    // usuario.email = body.email,
    // usuario.password = bcrypt.hashSync(body.password, 10),
    // usuario.img = body.img,
    usuario.role = body.role;

    // Actualizamos al usuario
    usuario.save((err, usuarioGuardado) => {
      // Manejo de errores
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el usuario",
          errors: err
        });
      }
      // Ocultamos el Password
      usuario.password = ":S";

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
});

// ==========================================================
// Crear un nuevo usuario
// ==========================================================
app.post("/", (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    apellidoP: body.apellidoP,
    apellidoM: body.apellidoM,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando el Usuario",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken: req.usuario
    });
  });
});

// ==========================================================
// Eliminar un usuario por el Id
// ==========================================================
app.delete("/:id", [mdAutentificacion.verificaToken, mdAutentificacion.verificaADMIN_ROLE ], (req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar usuario",
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe el usuario con ese id para ser borrado",
        errors: { message: "Usuario no encontrado con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});

module.exports = app;
