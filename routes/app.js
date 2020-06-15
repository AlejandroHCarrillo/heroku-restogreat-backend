var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion back end resto-great realizada con exito.'
    });
} );

module.exports = app;