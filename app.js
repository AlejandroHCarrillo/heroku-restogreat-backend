// Heroku constants
const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
// **************************************

portNumber = require("./config/config").portNumber;
mongoDBPort= require("./config/config").mongoDBPort;
databaseName = require("./config/config").databaseName;
console.log('databaseName:' + databaseName);


// Requires
// var express = require('express')
var mongoose = require('mongoose'),
// Schema = mongoose.Schema,
autoIncrement = require('mongoose-auto-increment');
var bodyParser = require('body-parser')

// Inicializar variables
var app = express()

// Configurar el CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin, Accept");
    next();
  });

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Body Parser
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas 
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')
var hospitalRoutes = require('./routes/hospital')
var medicoRoutes = require('./routes/medico')
var busquedaRoutes = require('./routes/busqueda')
var uploadRoutes = require('./routes/upload')
var imagenesRoutes = require('./routes/imagenes')

//Rutas Resto Great
var seccionRoutes = require('./routes/seccion');
var grupoRoutes = require('./routes/grupo');
var colaComandaRoutes = require('./routes/colacomanda');
var productoRoutes = require('./routes/producto');

var areaventaRoutes = require('./routes/areaventa');
var bancoRoutes = require('./routes/banco'); 
var causaCancelacionRoutes = require('./routes/causacancelacion');
var clienteRoutes = require('./routes/cliente');
var conceptoDescuentoRoutes = require('./routes/conceptodescuento');
var corteCajaRoutes = require('./routes/cortecaja');
var cuentaRoutes = require('./routes/cuenta');
var comensalRoutes = require('./routes/comensal');
var desembolsoCajaRoutes = require('./routes/desembolso-caja');
var facturaRoutes = require('./routes/factura');
var formaPagoRoutes = require('./routes/forma-pago');
var meseroRoutes = require('./routes/mesero');
var modificadorRoutes = require('./routes/modificador');
var turnoRoutes = require('./routes/turno');
var pagoRoutes = require('./routes/pago');
var parametroConfiguracionRoutes = require('./routes/parametro-configuracion');
var rubroRoutes = require('./routes/rubro');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:' + mongoDBPort + '/' + databaseName , { useNewUrlParser: true, useCreateIndex: true }, (err, res )=>{
    if (err) throw err;    
    console.log('Base de datos: \x1b[32m%s\x1b[0m ', ' on line ');    
} );

autoIncrement.initialize(mongoose.connection);

// Rutas
app.use('/seccion', seccionRoutes);
app.use('/grupo', grupoRoutes)
app.use('/colacomanda', colaComandaRoutes)
app.use('/producto', productoRoutes)

app.use('/areaventa', areaventaRoutes);
app.use('/banco', bancoRoutes);
app.use('/causacancelacion', causaCancelacionRoutes)
app.use('/cliente', clienteRoutes)
app.use('/conceptodescuento', conceptoDescuentoRoutes)
app.use('/cortecaja', corteCajaRoutes)
app.use('/cuenta', cuentaRoutes)
app.use('/comensal', comensalRoutes)
app.use('/desembolsocaja', desembolsoCajaRoutes)
app.use('/factura', facturaRoutes)
app.use('/formapago', formaPagoRoutes)
app.use('/mesero', meseroRoutes)
app.use('/modificador', modificadorRoutes)
app.use('/turno', turnoRoutes)
app.use('/pago', pagoRoutes)
app.use('/parametroconfiguracion', parametroConfiguracionRoutes)
app.use('/rubro', rubroRoutes)

app.use('/img', imagenesRoutes)
app.use('/upload', uploadRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/login', loginRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/medico', medicoRoutes)
app.use('/', appRoutes)

// Escuchar peticiones
app.listen(portNumber, () => { 
    console.log('El servidor express esta \x1b[32m%s\x1b[0m ', ' on line corriendo en el puerto ' +portNumber + '.');
} );

// 
