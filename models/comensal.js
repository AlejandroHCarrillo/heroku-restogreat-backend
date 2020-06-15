var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
    
autoIncrement.initialize(mongoose.connection);

var comensalSchema =	new Schema({
                consecutivo: { type: Number	},
                cuenta: { type: Schema.Types.ObjectId, ref: 'Cuenta' },
                numcomensal: { type: Number	},
                
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'comensales' });

module.exports = mongoose.model('Comensal', comensalSchema);