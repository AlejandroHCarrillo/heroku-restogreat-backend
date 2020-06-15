var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var facturaDetalleSchema =	new Schema({
				nombre: { type: String, required: [true, 'El nombre de la facturaDetalle es necesario']	},
				clave: { type: String, required: [true, 'La clave de la facturaDetalle es necesaria']	},
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'facturasetalles' });

module.exports = mongoose.model('FacturaDetalle', facturaDetalleSchema);