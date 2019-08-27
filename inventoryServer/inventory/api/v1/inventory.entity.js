const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    _id : {
        type : Date
    },
    stockIn : [{
        _id : {
            productId : {
                type : String,
            },
            wholeSellerId : {
                type : String
            }
        },
        packages : {
            type : String
        },
        pieces : {
            type : String
        }
    }],
    stockOut : [{
        _id : {
            productId : {
                type : String,
            },
            vendorId : {
                type : String
            }
        },
        packages : {
            type : String
        },
        pieces : {
            type : String
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