var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var cuentaSchema =	new Schema({
				consecutivo: { type: Number	},
				fecha: { type: String, required: [true, 'Fecha de la cuenta']	},
				numeromesa: { type: String },
                numerocomensales: { type: Number },
                mesero: { type: Schema.Types.ObjectId, ref: 'Mesero' },
                estatus: { type: Number },

                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'cuentas' });

cuentaSchema.plugin(autoIncrement.plugin, { model: 'cuenta', field: 'consecutivo' });
module.exports = mongoose.model('Cuenta', cuentaSchema);