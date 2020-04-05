const { Schema, model } = require('mongoose');

const BlockSchema = new Schema(
    {
        number: { type: Number, required: true },
        building_id: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = model('Block', BlockSchema);