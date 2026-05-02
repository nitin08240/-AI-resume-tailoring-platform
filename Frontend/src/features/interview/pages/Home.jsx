import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useToast } from '../../toast/toast.context.jsx'
import UsageMeter from '../components/UsageMeter.jsx'
import "../style/home.scss"

// ── Step Definitions ──────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Upload Resume' },
    { id: 2, label: 'About You'     },
    { id: 3, label: 'Job Details'   },
    { id: 4, label: 'Review'        },
]

// ── File Size Formatter ───────────────────────────────────────────────────────
const fmtSize = (bytes) => {
    if (bytes < 1024)            return `${bytes} B`
    if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// ── Step 1: Drop Zone ─────────────────────────────────────────────────────────
const StepUpload = ({ selectedFile, setSelectedFile, uploadError, setUploadError, resumeInputRef, dropZoneRef }) => {
    const handleFileSelect = (file) => {
        if (!file) return
        if (file.type !== 'application/pdf') { setUploadError('Only PDF files are supported'); return }
        if (file.size > 5 * 1024 * 1024)    { setUploadError('File size must be less than 5MB'); return }
        setUploadError(null)
        setSelectedFile(file)
    }

    const onInput = (e) => handleFileSelect(e.target.files?.[0])
    const onDragOver  = (e) => { e.preventDefault(); dropZoneRef.current?.classList.add('dropzone--active') }
    const onDragLeave = (e) => { e.preventDefault(); dropZoneRef.current?.classList.remove('dropzone--active') }
    const onDrop = (e) => {
        e.preventDefault()
        dropZoneRef.current?.classList.remove('dropzone--active')
        const file = e.dataTransfer.files?.[0]
        handleFileSelect(file)
        if (file && resumeInputRef.current) {
            const dt = new DataTransfer(); dt.items.add(file)
            resumeInputRef.current.files = dt.files
        }
    }

    return (
        <div className="step-content">
            <h3 className="step-content__heading">Upload Your Resume</h3>
            <p className="step-content__sub">Drag & drop your PDF resume or click to browse. Max 5 MB.</p>

            <label
                ref={dropZoneRef}
                className="dropzone"
                htmlFor="resume-upload"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                id="resume-dropzone"
            >
                <span className="dropzone__icon">
                    {selectedFile ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                    )}
                </span>
                <p className="dropzone__title">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                </p>
                <p className="dropzone__subtitle">
                    {selectedFile ? fmtSize(selectedFile.size) : 'PDF only — Max 5 MB'}
                </p>
                <input ref={resumeInputRef} hidden type="file" id="resume-upload" name="resume" accept=".pdf" onChange={onInput} />
            </label>

            {selectedFile && (
                <button
                    className="stepper-nav__back"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => { setSelectedFile(null); setUploadError(null) }}
                    id="remove-file-btn"
                >
                    × Remove file
                </button>
            )}

            {uploadError && <div className="upload-error" role="alert">{uploadError}</div>}
        </div>
    )
}

// ── Step 2: Self Description ──────────────────────────────────────────────────
const StepSelfDescription = ({ value, onChange }) => (
    <div className="step-content">
        <h3 className="step-content__heading">Tell Us About Yourself</h3>
        <p className="step-content__sub">Briefly describe your experience, skills, and background. Used to personalise the interview plan.</p>
        <textarea
            id="self-description-input"
            className="panel__textarea"
            style={{ flex: 1, minHeight: '220px' }}
            placeholder="e.g. 5 years of experience in frontend development, proficient in React, TypeScript and design systems..."
            value={value}
            onChange={e => onChange(e.target.value)}
            maxLength={2000}
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
            {value.length} / 2000
        </div>
    </div>
)

// ── Step 3: Job Description ───────────────────────────────────────────────────
const StepJobDescription = ({ value, onChange }) => (
    <div className="step-content">
        <h3 className="step-content__heading">Paste the Job Description</h3>
        <p className="step-content__sub">Copy the full JD from the job posting. The AI uses it to find skill gaps and tailor your resume.</p>
        <textarea
            id="job-description-input"
            className="panel__textarea"
            style={{ flex: 1, minHeight: '220px' }}
            placeholder="e.g. Senior Frontend Engineer at Acme Corp — React, TypeScript, system design..."
            value={value}
            onChange={e => onChange(e.target.value)}
            maxLength={5000}
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
            {value.length} / 5000
        </div>
    </div>
)

// ── Step 4: Review ────────────────────────────────────────────────────────────
const StepReview = ({ selectedFile, selfDescription, jobDescription }) => (
    <div className="step-content">
        <h3 className="step-content__heading">Review & Generate</h3>
        <p className="step-content__sub">Everything looks good? Hit Generate to let the AI build your personalised strategy.</p>

        <div className="review-item">
            <span className="review-item__label">Resume</span>
            <span className="review-item__value">
                {selectedFile ? `${selectedFile.name} (${fmtSize(selectedFile.size)})` : '⚠ No file uploaded'}
            </span>
        </div>

        <div className="review-item">
            <span className="review-item__label">Self Description</span>
            <span className="review-item__value">
                {selfDescription || <em style={{ color: 'var(--color-text-muted)' }}>Not provided</em>}
            </span>
        </div>

        <div className="review-item">
            <span className="review-item__label">Job Description</span>
            <span className="review-item__value">
                {jobDescription || <em style={{ color: 'var(--color-text-muted)' }}>Not provided</em>}
            </span>
        </div>
    </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
const Home = () => {
    const { generateReport, reports, loading } = useInterview()
    const { toast } = useToast()
    const navigate  = useNavigate()

    const [step, setStep]               = useState(1)
    const [animating, setAnimating]     = useState(false)
    const [jobDescription, setJD]       = useState('')
    const [selfDescription, setSD]      = useState('')
    const [selectedFile, setFile]       = useState(null)
    const [uploadError, setUploadError] = useState(null)

    const resumeInputRef = useRef()
    const dropZoneRef    = useRef()

    const progress = ((step - 1) / (STEPS.length - 1)) * 100

    // ── Validation per step ───────────────────────────────────────────────────
    const canProceed = () => {
        if (step === 1) return !!selectedFile
        if (step === 2) return selfDescription.trim().length > 0
        if (step === 3) return jobDescription.trim().length > 0
        return true
    }

    const goNext = () => {
        if (!canProceed()) {
            const msgs = {
                1: ['Missing Resume', 'Please upload your PDF resume to continue.'],
                2: ['Description Required', 'Please write a brief self description.'],
                3: ['Job Description Required', 'Please paste the job description.'],
            }
            const [title, msg] = msgs[step] || ['Incomplete', 'Please fill in the required field.']
            toast.warning(title, msg)
            return
        }
        if (step < STEPS.length) { setAnimating(true); setTimeout(() => { setStep(s => s + 1); setAnimating(false) }, 300) }
    }

    const goBack = () => {
        if (step > 1) { setAnimating(true); setTimeout(() => { setStep(s => s - 1); setAnimating(false) }, 300) }
    }

    // ── Final API call ────────────────────────────────────────────────────────
    const handleGenerate = async () => {
        try {
            toast.info('Generating…', 'Our AI is analysing your profile. This takes ~30 seconds.')
            const data = await generateReport({ jobDescription, selfDescription, resumeFile: selectedFile })
            if (data?._id) {
                toast.success('Report Ready!', 'Your personalised interview strategy has been generated.')
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            toast.error('Generation Failed', err?.response?.data?.message || err.message || 'Something went wrong.')
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" opacity=".25"/><path d="M21 12a9 9 0 0 1-9 9"/></svg>
                Generating your interview plan…
            </main>
        )
    }

    return (
        <div className="home-page">

            {/* Page Header */}
            <header className="page-header">
                <h1>Create Your Custom <span className="highlight">Interview Plan</span></h1>
                <p>Let our AI analyse the job requirements and your unique profile to build a winning strategy.</p>
                <div style={{ maxWidth: '300px', marginTop: '1rem' }}>
                    <UsageMeter />
                </div>
            </header>

            {/* Progress Bar */}
            <div className="stepper-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="stepper-progress__fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Step Tabs */}
            <div className="stepper-tabs" role="tablist">
                {STEPS.map((s) => {
                    const isDone   = step > s.id
                    const isActive = step === s.id
                    return (
                        <div
                            key={s.id}
                            className={`stepper-tab${isActive ? ' stepper-tab--active' : ''}${isDone ? ' stepper-tab--done' : ''}`}
                            role="tab"
                            aria-selected={isActive}
                        >
                            <span className="stepper-tab__bubble">
                                {isDone ? (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                ) : s.id}
                            </span>
                            <span className="stepper-tab__label">{s.label}</span>
                        </div>
                    )
                })}
            </div>

            {/* Main Card */}
            <div className="interview-card" style={{ maxWidth: '740px' }}>
                <div className={`stepper-body step-panel${animating ? ' step-panel--exit' : ''}`}>
                    {step === 1 && (
                        <StepUpload
                            selectedFile={selectedFile}
                            setSelectedFile={setFile}
                            uploadError={uploadError}
                            setUploadError={setUploadError}
                            resumeInputRef={resumeInputRef}
                            dropZoneRef={dropZoneRef}
                        />
                    )}
                    {step === 2 && <StepSelfDescription value={selfDescription} onChange={setSD} />}
                    {step === 3 && <StepJobDescription  value={jobDescription}  onChange={setJD} />}
                    {step === 4 && (
                        <StepReview
                            selectedFile={selectedFile}
                            selfDescription={selfDescription}
                            jobDescription={jobDescription}
                        />
                    )}
                </div>

                {/* Navigation Footer */}
                <div className="stepper-nav">
                    <button id="stepper-back-btn" className="stepper-nav__back" onClick={goBack} disabled={step === 1}>
                        ← Back
                    </button>
                    {step < STEPS.length ? (
                        <button id="stepper-next-btn" className="stepper-nav__next" onClick={goNext}>
                            Next →
                        </button>
                    ) : (
                        <button id="stepper-generate-btn" className="stepper-nav__next" onClick={handleGenerate}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                            Generate Strategy
                        </button>
                    )}
                </div>
            </div>

            {/* Recent Reports */}
            {reports.length > 0 && (
                <section className="recent-reports">
                    <h2>My Recent Interview Plans</h2>
                    <ul className="reports-list">
                        {reports.map(report => (
                            <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className="report-meta">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <footer className="page-footer">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Help Center</a>
            </footer>
        </div>
    )
}

export default Home