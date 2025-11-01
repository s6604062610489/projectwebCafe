const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    total_amount: {type: Number, required: true},
    orderDate: {type: Date, default: Date.now},
    orderItem: [
        {
            p_name: {type: String, required: true},
            p_quantity: {type: Number, required: true},
            p_price: {type: Number, required: true}
        }
    ]
});

module.exports = mongoose.model('Customer', customerSchema);