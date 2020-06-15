var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var grupoSchema =	new Schema({
				nombre: { type: String, required: [true, 'El nombre del grupo es necesario']	},
				clave: { type: String, required: [true, 'La clave del grupo es necesaria']	},
				img: { type: String, required: false },
				seccion: { type: Schema.Types.ObjectId, ref: 'Seccion', required: [true, 'La seccion del grupo es necesaria'] },
				usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
				fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'grupos' });

module.exports = mongoose.model('Grupo', grupoSchema);