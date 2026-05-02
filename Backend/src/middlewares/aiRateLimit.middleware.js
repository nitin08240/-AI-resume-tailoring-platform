const UsageLog = require('../models/usageLog.model');

const DAILY_LIMITS = {
    interview_report: 5,
    resume_generate: 3
};

/**
 * @name aiRateLimit
 * @description Custom middleware to enforce per-user daily limits on AI routes
 * @param {string} actionType - The type of AI action ('interview_report' or 'resume_generate')
 */
const aiRateLimit = (actionType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const limit = DAILY_LIMITS[actionType];

            // 1. Calculate the 24-hour window start
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // 2. Count existing logs and find the oldest one for the reset time
            const logs = await UsageLog.find({
                userId,
                action: actionType,
                createdAt: { $gte: twentyFourHoursAgo }
            }).sort({ createdAt: 1 });

            const usedCount = logs.length;

            // 3. Check if limit exceeded
            if (usedCount >= limit) {
                const oldestLog = logs[0];
                const resetsAt = new Date(oldestLog.createdAt.getTime() + 24 * 60 * 60 * 1000);

                return res.status(429).json({
                    success: false,
                    message: `Daily limit reached for ${actionType.replace('_', ' ')}. You can generate more after ${resetsAt.toLocaleTimeString()}.`,
                    limit,
                    used: usedCount,
                    resetsAt: resetsAt.toISOString()
                });
            }

            // 4. If under limit, proceed and log on success
            res.on('finish', async () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        await UsageLog.create({ userId, action: actionType });
                    } catch (err) {
                        console.error('Usage logging failed:', err);
                    }
                }
            });

            next();

        } catch (err) {
            console.error('Rate limit middleware error:', err);
            // On DB failure, allow the request to proceed (don't block the user)
            next();
        }
    };
};

module.exports = aiRateLimit;
