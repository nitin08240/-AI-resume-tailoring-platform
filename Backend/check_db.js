const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../Backend/.env') });

const interviewReportSchema = new mongoose.Schema({}, { strict: false });
const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);

async function checkLastReport() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        const lastReport = await InterviewReport.findOne().sort({ createdAt: -1 });
        if (!lastReport) {
            console.log('No reports found');
        } else {
            console.log('Last Report ID:', lastReport._id);
            console.log('Technical Questions Count:', lastReport.technicalQuestions?.length || 0);
            console.log('Technical Questions:', JSON.stringify(lastReport.technicalQuestions, null, 2));
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkLastReport();
