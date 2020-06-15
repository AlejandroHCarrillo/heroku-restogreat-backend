var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
	
autoIncrement.initialize(mongoose.connection);

var cortecajaSchema =	new Schema({
                consecutivo: { type: Number	},
                fecha: { type: Date },
                turno: { type: Schema.Types.ObjectId, ref: 'turno' },
				nombre: { type: String, required: [true, 'El nombre del corte de caja es necesario']	},
				clave: { type: String, required: [true, 'La clave del corte caja es necesaria']	},
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'cortescaja' });

cortecajaSchema.plugin(autoIncrement.plugin, { model: 'cortecaja', field: 'consecutivo' });
module.exports = mongoose.model('Cortecaja', cortecajaSchema);