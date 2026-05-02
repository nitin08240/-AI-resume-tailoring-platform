import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { ToastContext } from "../../toast/toast.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) throw new Error("useInterview must be used within an InterviewProvider")

    const { loading, setLoading, report, setReport, reports, setReports } = context

    // Toast is optional — silently degrade if provider is absent
    const toastCtx = useContext(ToastContext)
    const showError   = (title, msg) => toastCtx ? toastCtx.toast.error(title, msg)   : console.error(`${title}: ${msg}`)
    const showSuccess = (title, msg) => toastCtx ? toastCtx.toast.success(title, msg) : console.log(`${title}: ${msg}`)

    // ── Generate Report ───────────────────────────────────────────────────────
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            if (!resumeFile)                            throw new Error("Resume file is required")
            if (!selfDescription || !jobDescription)    throw new Error("Self description and job description are required")

            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (!response?.interviewReport)             throw new Error("Failed to generate interview report")

            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error("Error generating report:", error)
            showError("Generation Failed", error?.response?.data?.message || error.message || "Failed to generate interview report")
            throw error
        } finally {
            setLoading(false)
        }
    }

    // ── Get Single Report ─────────────────────────────────────────────────────
    const getReportById = async (id) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(id)
            if (!response?.interviewReport) throw new Error("Failed to fetch interview report")
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error("Error fetching report:", error)
            return null
        } finally {
            setLoading(false)
        }
    }

    // ── Get All Reports ───────────────────────────────────────────────────────
    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            if (!response?.interviewReports) throw new Error("Failed to fetch interview reports")
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (error) {
            console.error("Error fetching reports:", error)
            setReports([])
            return []
        } finally {
            setLoading(false)
        }
    }

    // ── Download Resume PDF ───────────────────────────────────────────────────
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            if (!response) throw new Error("Failed to generate PDF")

            const url  = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href  = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            showSuccess("PDF Downloaded", "Your tailored resume has been saved.")
        } catch (error) {
            console.error("Error downloading PDF:", error)
            showError("Download Failed", error?.response?.data?.message || error.message || "Failed to download resume")
            throw error
        } finally {
            setLoading(false)
        }
    }

    // ── Auto-fetch on mount ───────────────────────────────────────────────────
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}