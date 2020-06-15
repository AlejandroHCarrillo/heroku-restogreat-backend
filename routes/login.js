var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

SEED = require("../config/config").SEED;
TIMETOEXPIRE = require("../config/config").TIMETOEXPIRE;

MENU_USER = require("../config/menu").MENU_USER;
MENU_ADMIN = require("../config/menu").MENU_ADMIN;

var app = express();

var Usuario = require("../models/usuario");

//  Google
const CLIENT_ID = require("../config/config").CLIENT_ID;
const GOOGLE_SECRET = require("../config/config").GOOGLE_SECRET;

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);


var mdAutenticacion = require("../middlewares/autenticacion");

//  ==========================================================
//  Renovar el TOKEN
//  ==========================================================
app.get("/renuevatoken", mdAutenticacion.verificaToken, (req, res) => {
  // console.log('Renovando token...');
  var token = jwt.sign({ usuario: req.usuario }, SEED, {
    expiresIn: TIMETOEXPIRE
  });

  return res.status(200).json({
    ok: true,
    token: token
  });
});

//  ==========================================================
//  Autentificacion Google
//  npm install google-auth-library --save
//  ==========================================================
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  // console.log(payload);

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

// app.post("/google", async (req, res) => {
app.post("/google", (req, res) => {
  var token = req.body.token || "XXX";

  var client = new auth.OAuth2(CLIENT_ID, GOOGLE_SECRET, "");

  client.verifyIdToken(token, CLIENT_ID, function(e, login) {
    if (e) {
      return res.status(400).json({
        ok: true, 
        mensaje: 'Token no valido',
        errors: e
      });
    }
    var payload = login.getPayload();
    var userid = payload['sub'];
  });

  // // var googleUser = await verify(token).catch(err => {
  // var googleUser = verify(token).catch(err => {
  //   return res.status(403).json({
  //     ok: false,
  //     mensaje: "Token no valido",
  //     error: err
  //   });
  // });

  Usuario.findOne({ email: payload.email }, (err, usuarioDB) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al encontrar un usuario",
        errors: err
      });
    }

    //  Verifica que exista el usuario
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "Usar la autentificacion standar"
        });
      } else {
        usuarioDB.password = ":S";

        var token = jwt.sign({ usuario: usuarioDB }, SEED, {
          expiresIn: TIMETOEXPIRE
        });

        //   regresar respuesta
        res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id: usuarioDB.id,
          menu: obtenerMenu(usuarioDB.role)
        });
      }
      // return res.status(500).json({
      //   ok: false,
      //   mensaje: "Credenciales incorrectas (Usuario no existe)",
      //   errors: err
      // });
    } else {
      // El usuario no existe previamente, crearlo
      var usuario = new Usuario();

      usuario.nombre = payload.nombre;
      usuario.apellidoP = "";
      usuario.apellidoM = "";
      usuario.email = payload.email;
      usuario.password = ":S";
      usuario.img = payload.picture;
      usuario.google = true;

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error guardando el Usuario",
            errors: err
          });
        }

        var token = jwt.sign({ usuario: usuarioDB }, SEED, {
          expiresIn: TIMETOEXPIRE
        });

        res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id: usuarioDB._id,
          menu: obtenerMenu(usuarioDB.role)
        });
      });
    }
  });

  // return res.status(200).json({
  //   ok: true,
  //   mensaje: "Autentificacion google OK!!",
  //   googleUser: googleUser
  // });
});

//  ==========================================================
//  Autentificacion estandar
//  ==========================================================
app.post("/", (req, res) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    // validar si ocurrio un error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al encontrar un usuario",
        errors: err
      });
    }

    //  Verifica que exista el usuario
    if (!usuarioDB) {
      return res.status(500).json({
        ok: false,
        mensaje: "Credenciales incorrectas (Usuario no existe)",
        errors: err
      });
    }

    // Verificar el password correcto
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(500).json({
        ok: false,
        mensaje: "Credenciales incorrectas (Password incorrecto)",
        errors: err
      });
    }

    // Crear token que con 4 horas de vigencia
    usuarioDB.password = ":S";
    var token = jwt.sign({ usuario: usuarioDB }, SEED, {
      expiresIn: TIMETOEXPIRE
    });

    //   regresar respuesta
    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token: token,
      id: usuarioDB.id,
      menu: obtenerMenu(usuarioDB.role)
    });
  });
});

function obtenerMenu(ROLE) {
  if (ROLE === "ADMIN_ROLE") {
    return MENU_ADMIN;
  }
  else{
    return MENU_USER;
  }
}
// function obtenerMenu(ROLE) {
//   // console.log('El rol recibido es: ' + ROLE);
//   var menu = [
//     {
//       titulo: "Principal",
//       icono: "mdi mdi-gauge",
//       submenu: [
//         { titulo: "Dashboard", url: "/dashboard" },
//         { titulo: "ProgressBar", url: "/progress" },
//         { titulo: "Gráficas", url: "/graficas1" },
//         { titulo: "Promesas", url: "/promesas" },
//         { titulo: "RxJs", url: "/rxjs" }
//       ]
//     },
//     {
//       titulo: "Mantenimiento",
//       icono: "mdi mdi-folder-lock-open",
//       submenu: []
//     },
//     {
//       titulo: "Catalogos",
//       icono: "mdi mdi-folder-lock-open",
//       submenu: []
//     }
//   ];

//   if (ROLE === "ADMIN_ROLE") {
//     // console.log("es un administrador");
//     menu[2].submenu.unshift({ titulo: "Secciones", url: "/secciones" });
//     menu[2].submenu.push({ titulo: "Grupos", url: "/grupos" });
//     menu[2].submenu.push({ titulo: "Pila de Comandas", url: "/colascomanda" });
//     menu[2].submenu.push({ titulo: "Productos Platillos", url: "/producto" });

//     menu[1].submenu.unshift({ titulo: "Usuarios", url: "/usuarios" });
//     menu[1].submenu.push({ titulo: "Hospitales", url: "/hospitales" });
//     menu[1].submenu.push({ titulo: "Medicos", url: "/medicos" });
//   }
//   // console.log(menu);
//   return menu;
// }

module.exports = app;
