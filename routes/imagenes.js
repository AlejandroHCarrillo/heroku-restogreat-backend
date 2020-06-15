var express = require("express");
var app = express();

const path = require("path");
const fs = require("fs");

app.get("/:tipo/:img", (req, res) => {
  var tipo = req.params.tipo;
  var img = req.params.img;

  var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

  if (!fs.existsSync(pathImagen)) {
    pathImagen = path.resolve(__dirname, `../assets/no-img.png`);
  }
  res.sendFile(pathImagen);
});

module.exports = app;
