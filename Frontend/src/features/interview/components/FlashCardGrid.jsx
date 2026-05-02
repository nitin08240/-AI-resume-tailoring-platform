import React, { useState } from 'react'

// ── Flip Icon ─────────────────────────────────────────────────────────────────
const FlipIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
)

// ── Single Flash Card ─────────────────────────────────────────────────────────
export const FlashCard = ({ question, answer, index, total }) => {
    const [flipped, setFlipped] = useState(false)

    return (
        <div
            className="flashcard"
            id={`flashcard-${index}`}
            onClick={() => setFlipped(f => !f)}
            role="button"
            aria-pressed={flipped}
            aria-label={`Question ${index + 1} of ${total}. Click to ${flipped ? 'see question' : 'reveal answer'}`}
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}
        >
            <div className={`flashcard__inner${flipped ? ' flashcard__inner--flipped' : ''}`}>

                {/* ── Front ── */}
                <div className="flashcard__front">
                    <span className="flashcard__front-label">Question {index + 1}</span>
                    <p className="flashcard__question">{question}</p>
                    <span className="flashcard__flip-hint">
                        <FlipIcon /> Click to reveal answer
                    </span>
                </div>

                {/* ── Back ── */}
                <div className="flashcard__back">
                    <span className="flashcard__back-label">Model Answer Hint</span>
                    <p className="flashcard__answer">
                        {answer || 'Focus on demonstrating your practical experience and problem-solving approach. Use the STAR method (Situation, Task, Action, Result) for structure.'}
                    </p>
                    <span className="flashcard__counter">{index + 1} / {total}</span>
                </div>

            </div>
        </div>
    )
}

// ── Grid Wrapper ──────────────────────────────────────────────────────────────
const FlashCardGrid = ({ questions }) => {
    if (!questions || questions.length === 0) {
        return (
            <p className="empty-state" style={{ fontSize: '0.85rem' }}>
                No flashcards available for this report.
            </p>
        )
    }

    return (
        <div className="flashcard-section" id="flashcard-section">
            <p className="flashcard-section__hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Click any card to flip and reveal the model answer hint.
            </p>
            <div className="flashcard-grid">
                {questions.map((q, i) => (
                    <FlashCard
                        key={i}
                        index={i}
                        total={questions.length}
                        question={q.question}
                        answer={q.answer}
                    />
                ))}
            </div>
        </div>
    )
}

export default FlashCardGrid
