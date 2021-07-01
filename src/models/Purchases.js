const mongoose = require('mongoose');
const Users = require('./Users');
const labels = require('../labels/index');
const { LANGUAGE } = process.env;

const PurchasesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    title: {
        type: String,
        required: false,
        default: labels[LANGUAGE || 'en-US']?.['purchaseTitle']
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    weight: {
        type: Number,
        required: false,
        default: undefined
    },
    value: {
        type: Number,
        required: [true, 'missingValue']
    }
}, { timestamp: true });

// PurchasesSchema.post('save', async function (purchase, next) {
//     console.log(purchase);

//     let { _id: id, user } = purchase;
    
//     await Users.findByIdAndUpdate(user, { '$push': { 'purchases': id } }).catch();

//     next();
// });

// PurchasesSchema.post('findOneAndDelete', async function (purchase, next) {
//     let { _id: id, user } = purchase;
    
//     await Users.findByIdAndUpdate(user, { '$pull': { 'purchases': id } }).catch();

//     next();
// });


module.exports = mongoose.model('Purchases', PurchasesSchema);