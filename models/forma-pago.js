var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var formaPagoSchema =	new Schema({
	clave: { type: String, required: [true, 'La clave de la forma de pago es necesaria']	},
	nombre: { type: String, required: [true, 'El nombre de la forma de pago es necesario']	},
	tipo: { type: String, required: [true, 'El tipo de la forma de pago es necesario']	},
	comision: { type: Number },
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
	fechaAlta: { type: Date },
	fechaActualizacion: { type: Date }
},	{	collection: 'formaspago' });

module.exports = mongoose.model('FormaPago', formaPagoSchema);