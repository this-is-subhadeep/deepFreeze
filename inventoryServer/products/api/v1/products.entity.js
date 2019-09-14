const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id : {
        type : String
    },
    name : {
        type : String,
        required : [true, 'Name of the product must be present']
    },
    productType : {
        _id : String,
        name : String,
        showOrder : Number
    },
    startDate : {
        type : Date,
        required : true
    },
    endDate : {
        type : Date,
        required : true
    },
    details : [{
        _id : Date,
        packageSize : Number,
        costPrice : Number,
        sellingPrice : Number,
        productIcon : String
    }]
}, {
    versionKey : false
});

productSchema.post('find', (products) => {
    products.forEach(product => product.details.sort((det1, det2) => det1._id < det2._id ? 1: -1 ));
});

const productTypeSchema = new mongoose.Schema({
    _id : {
        type : String,
    },
    name : {
        type : String,
        required : [true, 'Name of the product type must be present']
    },
    showOrder : {
        type : Number,
        required : [true, 'Order to show this product type must be present']
    }
}, {
    versionKey : false
});

const ProductModel = new mongoose.model('products', productSchema);
const ProductTypeModel = new mongoose.model('productType', productTypeSchema);

module.exports = {
    ProductModel,
    ProductTypeModel
}