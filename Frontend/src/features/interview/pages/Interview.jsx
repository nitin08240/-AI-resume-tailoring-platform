import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { useToast } from '../../toast/toast.context.jsx'
import { SkeletonReport } from '../../shared/Skeletons.jsx'
import SkillMatchMeter from '../components/SkillMatchMeter.jsx'
import KeywordGapPills from '../components/KeywordGapPills.jsx'
import FlashCardGrid from '../components/FlashCardGrid.jsx'
import DashboardStats from '../components/DashboardStats.jsx'
import EmptyState from '../../shared/EmptyState.jsx'
import UsageMeter from '../components/UsageMeter.jsx'

// ── Nav items (extended with flashcards tab) ──────────────────────────────────
const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical Qs', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        )
    },
    {
        id: 'behavioral', label: 'Behavioral Qs', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )
    },
    {
        id: 'flashcards', label: 'Flashcards', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        )
    },
    {
        id: 'roadmap', label: 'Road Map', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        )
    },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const copyToClipboard = (e, text) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text)
        toast.info('Copied!', 'Answer copied to clipboard.')
    }

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className="q-card__header" onClick={() => setOpen(o => !o)}>
                <div className="q-card__title-row">
                    <span className="q-card__index">Q{index + 1}</span>
                    <p className="q-card__question">{item.question}</p>
                </div>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
            </div>
            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <div className="q-card__section-header">
                            <span className="q-card__tag q-card__tag--intention">Interviewer's Intention</span>
                        </div>
                        <p className="q-card__text">{item.intention}</p>
                    </div>
                    <div className="q-card__section q-card__section--highlight">
                        <div className="q-card__section-header">
                            <span className="q-card__tag q-card__tag--answer">Best Suitable Answer</span>
                            <button 
                                className="q-card__copy-btn" 
                                onClick={(e) => copyToClipboard(e, item.answer)}
                                title="Copy answer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                        </div>
                        <p className="q-card__text q-card__text--answer">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__badge">Day {day.day}</span>
            <h3 className="roadmap-day__focus">{day.focus}</h3>
        </div>
        <ul className="roadmap-day__tasks">
            {day.tasks.map((task, i) => (
                <li key={i}><span className="roadmap-day__bullet" />{task}</li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf, reports } = useInterview()
    const { interviewId } = useParams()
    const { toast } = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="interview-page">
                <div className="interview-layout" style={{ flexDirection: 'column' }}>
                    <SkeletonReport />
                </div>
            </div>
        )
    }

    // ── Empty / dashboard view ────────────────────────────────────────────────
    if (!interviewId) {
        return (
            <div className="home-page">
                <header className="page-header">
                    <h1>My <span className="highlight">Interview Reports</span></h1>
                    <p>Track your progress, review past strategies, and download tailored resumes.</p>
                </header>

                {/* Dashboard Stats */}
                {reports.length > 0
                    ? <DashboardStats reports={reports} />
                    : <EmptyState />
                }
            </div>
        )
    }

    if (!report) return null

    const technicalQuestions  = report.technicalQuestions  || []
    const behavioralQuestions = report.behavioralQuestions || []
    const preparationPlan     = report.preparationPlan     || []
    const skillGaps           = report.skillGaps           || []
    const matchScore          = report.matchScore ?? null

    const scoreColor =
        matchScore === null ? 'score--low' :
        matchScore >= 80    ? 'score--high' :
        matchScore >= 60    ? 'score--mid'  : 'score--low'

    const handleDownload = async () => {
        try {
            await getResumePdf(interviewId)
            toast.success('PDF Downloaded', 'Your tailored resume has been saved.')
        } catch {
            toast.error('Download Failed', 'Could not generate the resume PDF.')
        }
    }

    return (
        <div className="interview-page">
            <div className="interview-layout">

                {/* ── Left Nav ── */}
                <nav className="interview-nav">
                    <div className="nav-content">
                        <p className="interview-nav__label">Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                id={`nav-${item.id}`}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className="interview-nav__icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        id="download-resume-btn"
                        onClick={handleDownload}
                        className="button primary-button"
                    >
                        <svg height="0.8rem" style={{ marginRight: '0.8rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"/></svg>
                        Download Resume
                    </button>
                </nav>

                <div className="interview-divider" />

                {/* ── Center Content ── */}
                <main className="interview-content">
                    {activeNav === 'technical' && (
                        <section>
                            <div className="content-header">
                                <h2>Technical Questions</h2>
                                <span className="content-header__count">{technicalQuestions.length} questions</span>
                            </div>
                            <div className="q-list">
                                {technicalQuestions.length > 0
                                    ? technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)
                                    : <p className="empty-state">No technical questions generated.</p>
                                }
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className="content-header">
                                <h2>Behavioral Questions</h2>
                                <span className="content-header__count">{behavioralQuestions.length} questions</span>
                            </div>
                            <div className="q-list">
                                {behavioralQuestions.length > 0
                                    ? behavioralQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)
                                    : <p className="empty-state">No behavioral questions generated.</p>
                                }
                            </div>
                        </section>
                    )}

                    {activeNav === 'flashcards' && (
                        <section>
                            <div className="content-header">
                                <h2>Interview Flashcards</h2>
                                <span className="content-header__count">
                                    {technicalQuestions.length + behavioralQuestions.length} cards
                                </span>
                            </div>
                            <FlashCardGrid questions={[...technicalQuestions, ...behavioralQuestions]} />
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className="content-header">
                                <h2>Preparation Road Map</h2>
                                <span className="content-header__count">{preparationPlan.length}-day plan</span>
                            </div>
                            <div className="roadmap-list">
                                {preparationPlan.length > 0
                                    ? preparationPlan.map(day => <RoadMapDay key={day.day} day={day} />)
                                    : <p className="empty-state">No roadmap generated for this report.</p>
                                }
                            </div>
                        </section>
                    )}
                </main>

                <div className="interview-divider" />

                {/* ── Right Sidebar ── */}
                <aside className="interview-sidebar">

                    {/* SVG Gauge */}
                    <SkillMatchMeter score={matchScore} />

                    <div className="sidebar-divider" />

                    {/* Keyword Gaps */}
                    <div className="skill-gaps">
                        <p className="skill-gaps__label">Keyword Gaps</p>
                        <KeywordGapPills skillGaps={skillGaps} />
                    </div>

                    <div className="sidebar-divider" />

                    {/* Usage Meter */}
                    <UsageMeter />

                </aside>
            </div>
        </div>
    )
}

export default Interview