const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
const aiRateLimit = require("../middlewares/aiRateLimit.middleware")
const UsageLog = require("../models/usageLog.model")

const interviewRouter = express.Router()

/**
 * @route GET /api/interview/usage-stats
 * @description get current user AI usage statistics for last 24h
 * @access private
 */
interviewRouter.get("/usage-stats", authMiddleware.authUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const window = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const logs = await UsageLog.find({
            userId,
            createdAt: { $gte: window }
        }).sort({ createdAt: 1 });

        const stats = {
            interview_report: { used: 0, limit: 5 },
            resume_generate: { used: 0, limit: 3 },
            resetsAt: logs.length > 0 ? new Date(logs[0].createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString() : null
        };

        logs.forEach(log => {
            if (stats[log.action]) stats[log.action].used++;
        });

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: "Error fetching usage stats" });
    }
});

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", 
    authMiddleware.authUser, 
    aiRateLimit('interview_report'), 
    upload.single("resume"), 
    interviewController.generateInterViewReportController
)

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", 
    authMiddleware.authUser, 
    aiRateLimit('resume_generate'), 
    interviewController.generateResumePdfController
)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

module.exports = interviewRouter