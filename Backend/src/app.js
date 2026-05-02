const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Global error handler for multer
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: "File size too large. Maximum size is 5MB"
        })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            message: "Too many files. Only one file is allowed"
        })
    }
    if (err.message && err.message.includes('Only PDF files')) {
        return res.status(400).json({
            message: "Only PDF files are supported. Please upload a PDF resume"
        })
    }
    if (err) {
        return res.status(400).json({
            message: err.message || "File upload error"
        })
    }
    next()
})

module.exports = app