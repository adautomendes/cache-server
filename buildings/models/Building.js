const { Schema, model } = require('mongoose');

const BuildingSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = model('Building', BuildingSchema);