var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var causaCancelacionSchema =	new Schema({
				nombre: { type: String, required: [true, 'La causa de la cancelacion es necesaria']	},
				clave: { type: String },
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'causascancelacion' });

module.exports = mongoose.model('CausaCancelacion', causaCancelacionSchema);