const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    p_code: { type: String, unique: true },
    p_name:{type: String, required: true},
    p_price:{type: Number, required: true},
    p_details:{type: String},
    p_img:{type: String},
    p_quantity:{type: Number, required: true ,default: 1},
    category:{type: String, required: true}
});

module.exports = mongoose.model('Product', productSchema, 'products');