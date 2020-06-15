var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
	
autoIncrement.initialize(mongoose.connection);

var pagoSchema =	new Schema({
                consecutivo: { type: Number	},
                cuenta: { type: Schema.Types.ObjectId, ref: 'Cuenta' },
                formaPago : {type: Schema.Types.ObjectId, ref: 'FormaPago' },
                monto: { type: Number, required: [true, 'El monto del pago es necesario'], default: 0 },
                referencia: { type: String },
                observaciones: { type: String },
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'pagos' });

pagoSchema.plugin(autoIncrement.plugin, { model: 'pago', field: 'consecutivo' });
module.exports = mongoose.model('Pago', pagoSchema);