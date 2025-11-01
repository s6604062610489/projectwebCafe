const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    order_num:{type: Number, required: true},
    member_id: { type: String, required: true},
    order_item:[
        {
            p_code: { type: String, required: true},
            p_name: { type: String, required: true},
            p_price: { type: Number, required: true},
            p_quantity: { type: Number, required: true}
        }
    ],
    total_price: { type: Number, required: true },
    order_time:{type: Date , default: () => {
        const now = new Date();
        now.setHours(now.getHours() + 7);
        now.setSeconds(0, 0);
        return now;
    }}
});

module.exports = mongoose.model('Receipt', receiptSchema, 'receipt');