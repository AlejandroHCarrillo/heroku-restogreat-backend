var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var conceptodescuentoSchema =	new Schema({
				nombre: { type: String, required: [true, 'El concepto del descuento es necesario']	},
				clave: { type: String, required: [true, 'La clave del concepto del descuento es necesaria']	},
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'conceptosdescuento' });

module.exports = mongoose.model('Conceptodescuento', conceptodescuentoSchema);