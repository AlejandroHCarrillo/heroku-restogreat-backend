var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
    
autoIncrement.initialize(mongoose.connection);

var platilloSchema =	new Schema({
                comensal: { type: Schema.Types.ObjectId, ref: 'Comensal' },
                consecutivo: { type: Number	},
                producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
                nombreplatillo: { type: String },
                modificadores: { type: String },
                estatus: { type: Number },

                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'platillos' });

module.exports = mongoose.model('Platillo', platilloSchema);