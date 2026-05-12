const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    featureKey: {
        type: String,
        required: true,
        trim: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
}, {
    timestamps: true
});

featureSchema.index({ featureKey: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model('Feature', featureSchema);  