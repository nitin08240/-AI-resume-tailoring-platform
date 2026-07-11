require("dotenv").config()
const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const genAiApiKey = process.env.GOOGLE_GENAI_API_KEY
if (!genAiApiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY environment variable is required")
}

const ai = new GoogleGenAI({
    apiKey: genAiApiKey
})

function parseMaybeJsonString(value) {
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
            return JSON.parse(trimmed)
        } catch (err) {
            return value
        }
    }
    return value
}

function normalizeArrayOfObjects(arr) {
    if (!Array.isArray(arr)) return arr
    return arr.map(item => parseMaybeJsonString(item))
}

function normalizeInterviewReport(report) {
    return {
        ...report,
        technicalQuestions: normalizeArrayOfObjects(report.technicalQuestions),
        behavioralQuestions: normalizeArrayOfObjects(report.behavioralQuestions),
        skillGaps: normalizeArrayOfObjects(report.skillGaps),
        preparationPlan: normalizeArrayOfObjects(report.preparationPlan),
    }
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert technical interviewer. Based on the candidate's Resume, Self Description, and the Job Description provided, generate a COMPREHENSIVE interview preparation report in JSON format.
    
    CRITICAL: You MUST return a JSON object that EXACTLY matches this structure.
    Do not wrap objects or arrays inside strings. All arrays must contain real JSON objects, not string values.

    {
      "title": "A relevant title for this report",
      "matchScore": (a number between 0 and 100),
      "technicalQuestions": [
        { "question": "...", "intention": "...", "answer": "..." }
      ],
      "behavioralQuestions": [
        { "question": "...", "intention": "...", "answer": "..." }
      ],
      "skillGaps": [
        { "skill": "...", "severity": "low" | "medium" | "high" }
      ],
      "preparationPlan": [
        { "day": 1, "focus": "...", "tasks": ["...", "..."] }
      ]
    }

    CANDIDATE DATA:
    - Resume: ${resume}
    - Self Description: ${selfDescription}
    - Job Description: ${jobDescription}

    Instructions:
    1. generate 5-8 highly relevant technical questions.
    2. generate 3-5 behavioral questions.
    3. Identify at least 3 skill gaps.
    4. Provide a 5-day preparation plan.
    5. Return ONLY the JSON object.`

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    const text = typeof result.text === 'function' ? result.text() : (result.text || result.response?.text?.() || "");
    console.log("AI Response Text (Raw):", text);
    
    if (!text) throw new Error("AI returned empty response");
    
    // Extract JSON from potential markdown/text wrapper
    const jsonMatch = text.match(/\{[\s\S]*\}$/);
    if (!jsonMatch) throw new Error("No JSON object found in AI response");
    
    const rawReport = JSON.parse(jsonMatch[0])
    return normalizeInterviewReport(rawReport)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a professional resume for a candidate based on:
                    - Resume: ${resume}
                    - Self Description: ${selfDescription}
                    - Job Description: ${jobDescription}

                    Return a JSON object with a single field "html" containing a beautifully styled, ATS-friendly HTML resume.
                    Include modern CSS for a premium look (gradients, clear headings, nice fonts).`

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const text = typeof result.text === 'function' ? result.text() : (result.text || result.response?.text?.() || "");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in AI response");
    
    const jsonContent = JSON.parse(jsonMatch[0])

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }


// of lechnology in Computer Science\nkajiv Gandni lechnical University \n2ez1\n\n -- 3 01 3 -- \n\n ,

