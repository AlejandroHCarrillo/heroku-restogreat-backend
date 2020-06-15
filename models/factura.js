var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
	
autoIncrement.initialize(mongoose.connection);

var facturaSchema =	new Schema({
				consecutivo: { type: Number	},
				nombre: { type: String, required: [true, 'El nombre de la factura es necesario']	},
				clave: { type: String, required: [true, 'La clave de la factura es necesaria']	},
				usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
				fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'facturas' });

facturaSchema.plugin(autoIncrement.plugin, { model: 'factura', field: 'consecutivo' });
module.exports = mongoose.model('Factura', facturaSchema);