var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var modificadorSchema =	new Schema({
				nombre: { type: String, required: [true, 'El modificador de rubro es necesario']	},
				clave: { type: String, required: [true, 'La clave del modificador de rubro es necesaria']	},
				rubro: { type: Schema.Types.ObjectId, ref: 'Rubro', required: [true, 'El rubro del modificador es necesario'] },
				usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
				fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'modificadores' });

module.exports = mongoose.model('Modificador', modificadorSchema);