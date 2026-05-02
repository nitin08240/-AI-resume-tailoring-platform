const mongoose = require("mongoose")

const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is required")
}

async function connectToDB() {
    try {
        await mongoose.connect(mongoUri)
        console.log("Connected to Database")
    } catch (err) {
        console.error("MongoDB connection failed:", err.message)
        console.error(err)
       
    }
}

module.exports = connectToDB