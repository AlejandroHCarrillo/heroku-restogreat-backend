var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var desembolsoCajaSchema =	new Schema({
				nombre: { type: String, required: [true, 'El nombre de la desembolsoCaja es necesario']	},
				clave: { type: String, required: [true, 'La clave de la desembolsoCaja es necesaria']	},
				usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
				fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'desembolsosCaja' });

module.exports = mongoose.model('DesembolsoCaja', desembolsoCajaSchema);