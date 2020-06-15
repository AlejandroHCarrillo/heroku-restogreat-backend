var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
	
autoIncrement.initialize(mongoose.connection);

var productoSchema =	new Schema({
        consecutivo: { type: Number	},
        clave: { type: String, required: [true, 'La clave del producto es necesario']	},
        grupo: { type: Schema.Types.ObjectId, ref: 'Grupo', required: [true, 'El grupo del producto es necesario'] },
        nombre: { type: String, required: [true, 'El nombre del producto es necesario']	},
        nombreCorto: { type: String, required: [true, 'El nombre corto del producto es necesario']	},
        descripcion: { type: String, required: [true, 'La descripcion del producto es necesaria']	},
        precio: { type: Number, required: [true, 'El precio del producto es necesario']	},
        tienePrecioAbierto: { type: Boolean },
        imprimir: { type: Boolean },
        colaComandas: { type: Schema.Types.ObjectId, ref: 'ColaComandas' },
        img: { type: String, required: false },
        fechaAlta: { type: Date },
        fechaActualizacion: { type: Date },
        usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},	{	collection: 'productos' });

productoSchema.plugin(autoIncrement.plugin, { model: 'producto', field: 'consecutivo' });
module.exports = mongoose.model('Producto', productoSchema);