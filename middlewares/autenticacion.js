var jwt = require("jsonwebtoken");

SEED = require("../config/config").SEED;

// ==========================================================
// Middleware: Verificar token
// Todos los metodos siguientes son protegidos por el token
// ==========================================================

exports.verificaToken = function(req, res, next) {
  var token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token no valido o expirado ",
        errors: err
      });
    }

    req.usuario = decoded.usuario;
    next();

  });
};

// ==========================================================
// Middleware: Verificar ADMIN
// Todos los metodos siguientes son solo para Administradores
// ==========================================================

exports.verificaADMIN_ROLE = function(req, res, next) {

  var usuario = req.usuario

  if (usuario.role == "ADMIN_ROLE" ){
    next();
    return;
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: "El usuario no es administrador",
      errors: { message : "Peticion reservada solo para administradores." }
    });
  }
};

// ==========================================================
// Middleware: Verificar ADMIN o El mismo usuario
// El metodos siguientes son solo para Administradores o para el propioUsuario
// ==========================================================

exports.verificaADMIN_o_MismoUsuario = function(req, res, next) {

  var usuario = req.usuario
  var id = req.params.id

  if (usuario.role == "ADMIN_ROLE" || usuario.id == id ){
    next();
    return;
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: "El usuario no es administrador ni es el propio usuario",
      errors: { message : "Peticion reservada solo para administradores." }
    });
  }
};
