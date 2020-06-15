var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var rubroSchema =	new Schema({
				nombre: { type: String, required: [true, 'El nombre del rubro es necesario']	},
				clave: { type: String, required: [true, 'La clave del rubro es necesaria']	},
				seccion: { type: Schema.Types.ObjectId, ref: 'Seccion', required: [true, 'La seccion del rubro es necesaria'] },
				usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'rubros' });

module.exports = mongoose.model('Rubro', rubroSchema);