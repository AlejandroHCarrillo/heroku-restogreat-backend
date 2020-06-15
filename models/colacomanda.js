var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var colaComandaSchema =	new Schema({
				nombre: { type: String, required: [true, 'El nombre de la cola de comandas es necesario']	},
				// descripcion: { type: String, required: [true, 'La descripcion de la cola de comandas es necesaria'] },
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'colasComandas' });

module.exports = mongoose.model('ColaComandas', colaComandaSchema);