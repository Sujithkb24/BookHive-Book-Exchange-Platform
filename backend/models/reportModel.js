const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportedEmails:{
        type: String,
        required: true,
        trim: true
    }
})

const reportModel = mongoose.model('report', reportSchema);

module.exports = reportModel;
