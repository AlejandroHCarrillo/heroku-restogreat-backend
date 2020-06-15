var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
	
autoIncrement.initialize(mongoose.connection);

var turnoSchema =	new Schema({
    consecutivo: { type: Number	},
    fecha: { type: Date, required: [true, 'La fecha del turno es necesaria'] },
    numero: { type: Number, required: [true, 'El numero de turno es necesario']	},
    mesero: { type: Schema.Types.ObjectId, ref: 'Mesero' },
    fondocaja: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaAlta: { type: Date },
    fechaActualizacion: { type: Date }
},	{ collection: 'turnos' });

turnoSchema.plugin(autoIncrement.plugin, { model: 'turno', field: 'consecutivo' });
module.exports = mongoose.model('Turno', turnoSchema);