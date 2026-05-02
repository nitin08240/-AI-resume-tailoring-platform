import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsageMeter = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/interview/usage-stats', { withCredentials: true });
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch usage stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Refresh every 5 minutes
        const interval = setInterval(fetchStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !stats) return null;

    const renderBar = (label, key) => {
        const { used, limit } = stats[key];
        const pct = (used / limit) * 100;
        const isFull = used >= limit;

        return (
            <div className="usage-bar">
                <div className="usage-bar__header">
                    <span className="usage-bar__label">{label}</span>
                    <span className={`usage-bar__count ${isFull ? 'usage-bar__count--limit' : ''}`}>
                        {used} / {limit}
                    </span>
                </div>
                <div className="usage-bar__track">
                    <div 
                        className={`usage-bar__fill ${isFull ? 'usage-bar__fill--limit' : ''}`} 
                        style={{ width: `${Math.min(pct, 100)}%` }} 
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="usage-meter">
            <p className="usage-meter__title">Daily AI Usage</p>
            {renderBar('Interview Reports', 'interview_report')}
            {renderBar('Resume Generations', 'resume_generate')}
            
            {stats.resetsAt && (stats.interview_report.used >= stats.interview_report.limit || stats.resume_generate.used >= stats.resume_generate.limit) && (
                <p className="usage-meter__reset">
                    Next slot available at {new Date(stats.resetsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            )}
        </div>
    );
};

export default UsageMeter;
