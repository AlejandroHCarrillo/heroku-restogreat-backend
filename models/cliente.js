var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
	
autoIncrement.initialize(mongoose.connection);

var clienteSchema =	new Schema({
				consecutivo: { type: Number	},
				nombre: { type: String, required: [true, 'El nombre del cliente es necesario'] },
				rfc: { type: String, required: [true, 'El RFC del cliente es necesario'] },
				direccionCalle: { type: String, required: [true, 'La calle de la direccion del cliente es necesaria'] },
				direccionNumero: { type: String },
				direccionColonia: { type: String, required: [true, 'La Colonia o poblacion del cliente es necesaria'] },
				direccionMunicipio: { type: String, required: [true, 'El municipio o alcaldia del cliente es necesario'] },
				direccionEstado: { type: String, required: [true, 'El estado del cliente es necesario'] },
				direccionCP: { type: String, required: [true, 'El codigo postal del cliente es necesario'] },
				correoelectronico: { type: String, required: [true, 'El correo electronico del cliente es necesario'] },
				telefono: { type: String },				
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                fechaAlta: { type: Date },
                fechaActualizacion: { type: Date }
},	{	collection: 'clientes' });

clienteSchema.plugin(autoIncrement.plugin, { model: 'cliente', field: 'consecutivo' });
module.exports = mongoose.model('Cliente', clienteSchema);