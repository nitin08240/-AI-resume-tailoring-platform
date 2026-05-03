const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../Backend/.env') });

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function listModels() {
    try {
        console.log('Fetching models...');
        const result = await ai.models.list();
        console.log('Available Models:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error listing models:', err);
    }
}

listModels();
