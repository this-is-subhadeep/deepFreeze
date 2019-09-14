const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    _id : {
        type : String
    },
    name : {
        type : String,
        required : [true, 'Name of the vendor must be present']
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
        loanAdded : Number,
        loanPayed : Number,
        openingDp : Number,
        remarks : String,
        dpFile : String
    }]
}, {
    versionKey : false
});

vendorSchema.post('find', (vendors) => {
    vendors.forEach(vendor => vendor.details.sort((det1, det2) => det1._id < det2._id ? 1: -1 ));
});

const VendorModel = new mongoose.model('vendor', vendorSchema);

module.exports = {
    VendorModel
}