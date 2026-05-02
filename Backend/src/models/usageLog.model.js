const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['interview_report', 'resume_generate'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '24h' } // TTL index: auto-delete after 24 hours
    }
});

module.exports = mongoose.model('UsageLog', usageLogSchema);
