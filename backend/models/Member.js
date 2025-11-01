const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    member_id: { type: String, unique: true },
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true},
    phone: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    point: {type: Number, default: 0},
    password: {type: String, required: true},
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

module.exports = mongoose.model('Member', memberSchema, 'member');