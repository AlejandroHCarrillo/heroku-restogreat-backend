PAGESIZE = require("../config/config").PAGESIZE;
var express = require("express");

var mdAutentificacion = require("../middlewares/autenticacion");

var app = express();
var Cuenta = require("../models/cuenta");
var Comensal = require("../models/comensal");
var Platillo = require("../models/platillo");

// ==========================================================
// Obtener todos los comensales
// ==========================================================
app.get("/", (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Comensal.find({}, "nombre clave")
        .populate("usuario", "nombre")
        .skip(desde)
        .limit(PAGESIZE)
        .exec((err, comensales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando las comensales",
                    errors: err
                });
            }

            Comensal.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    comensales: comensales,
                    total: conteo
                });
            });
        });
});

// ==========================================
// Obtener Comensal por ID
// ==========================================
app.get("/:id", (req, res) => {
    var id = req.params.id;
    Comensal.findById(id)
        .populate("usuario", "nombre")
        .exec((err, comensal) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar comensal",
                    errors: err
                });
            }
            if (!comensal) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "La comensal con el id " + id + "no existe",
                    errors: { message: "No existe un comensal con ese ID" }
                });
            }
            res.status(200).json({
                ok: true,
                comensal: comensal
            });
        });
});

// ==========================================
// Obtener Comensales por Cuenta ID
// ==========================================
app.get("/cuenta/:id", (req, res) => {
    var id = req.params.id;

    Cuenta.findById(id)
        .populate("comensal", "")
        .exec((err, cuenta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar la cuenta",
                    errors: err
                });
            }
            if (!cuenta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "La cuenta con el id " + id + "no existe",
                    errors: { message: "No existe una cuenta con ese ID" }
                });
            }

            Comensal.find({ "cuenta": cuenta })
                .exec((err, comensales) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: "Error al buscar comensales",
                            errors: err
                        });
                    }
                    if (!comensales) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: "La comensales de la cuenta con el id " + id + " no existen",
                            errors: { message: "No existen comensales para la cuenta con ese ID" }
                        });
                    }

                    var strComensales = "";
                    for (let index = 0; index < comensales.length; index++) {
                        let strComensal = JSON.stringify(comensales[index]);
                        strComensal = strComensal.replace("\"numcomensal", "\"platillos\": XXX , \"numcomensal");

                        Platillo.find({ "comensal": comensales[index] })
                            .exec((err, platillos) => {
                                if (err){
                                    console.log("Error al obtener platillos: ", err);
                                }
                                let com = "";
                                if (platillos) {
                                    let strPlatillos = JSON.stringify(platillos);
                                    // console.log("strPlatillos", strPlatillos);
                                    try {
                                        com = strComensal.replace("XXX", strPlatillos);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                                
                                strComensales += com + ",";

                                if (index === comensales.length - 1) {
                                    return res.status(200).json({
                                        ok: true,
                                        comensales: JSON.parse("[" + strComensales.slice(0, -1) + "]"),
                                        total: comensales.length
                                    });
                                } else {

                                }
                            })

                    }

                });

        });
});

// ==========================================================
// Actualizar Comensal
// ==========================================================
app.put("/:id", mdAutentificacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Comensal.findById(id, (err, comensal) => {
        // validar si ocurrio un error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar un comensal",
                errors: err
            });
        }
        // validar si no hay datos para actualizar
        if (!comensal) {
            return res.status(400).json({
                ok: false,
                mensaje: "El comensal con el id " + id + " no existe",
                errors: { message: "No existe un comensal con ese ID" }
            });
        }

        var body = req.body;

        comensal.nombre = body.nombre;
        comensal.clave = body.clave;

        comensal.usuario = req.usuario._id;
        comensal.fechaActualizacion = new Date();

        // Actualizamos la comensal
        comensal.save((err, comensalGuardado) => {
            // Manejo de errores
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar el comensal",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                comensal: comensalGuardado
            });
        });
    });
});

// ==========================================================
// Crear una nueva comensal
// ==========================================================
app.post("/", mdAutentificacion.verificaToken, (req, res) => {
    var body = req.body;

    var comensal = new Comensal({
        nombre: body.nombre,
        clave: body.clave,

        usuario: req.usuario._id,
        fechaAlta: new Date()
    });

    comensal.save((err, comensalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error guardando la comensal",
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            comensal: comensalGuardado
        });
    });
});

// ==========================================================
// Eliminar una comensal por el Id
// ==========================================================
app.delete("/:id", mdAutentificacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Comensal.findByIdAndDelete(id, (err, comensalBorrado) => {
        // validar si ocurrio un error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar comensal",
                errors: err
            });
        }

        if (!comensalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe la comensal con ese id para ser borrada",
                errors: { message: "Comensal no encontrada con ese id" }
            });
        }

        res.status(200).json({
            ok: true,
            comensal: comensalBorrado
        });
    });
});

module.exports = app;
