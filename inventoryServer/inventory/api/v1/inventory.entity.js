const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    _id : {
        type : Date
    },
    stockIn : [{
        _id : {
            productId : {
                type : String,
                require : [true, "Product Id must be present"]
            },
            wholeSellerId : {
                type : String
            }
        },
        packages : {
            type : Number
        },
        pieces : {
            type : Number,
            require : [true, "Pieces Id must be present"]
        }
    }],
    stockOut : [{
        _id : {
            productId : {
                type : String,
                require : [true, "Product Id must be present"]
            },
            vendorId : {
                type : String,
                require : [true, "Vendor Id must be present"]
            }
        },
        packages : {
            type : Number
        },
        pieces : {
            type : Number,
            require : [true, "Pieces Id must be present"]
        }
    }],
    deposits : [{
        _id : {
            vendorId : {
                type : String,
                require : [true, "Vendor Id must be present"]
            }
        },
        amount : {
            type : Number
        }
    }]
}, {
    versionKey : false
});

inventorySchema.post('find', (inventoryList) => {
    inventoryList.sort((inv1, inv2) => inv1._id < inv2._id ? 1: -1 );
});

const InventoryModel = new mongoose.model('inventory', inventorySchema);

module.exports = {
    InventoryModel
}