import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../../toast/toast.context';

const UserDropdown = () => {
    const { user, handleLogout } = useAuth();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onLogout = async () => {
        try {
            await handleLogout();
            toast.success('Logged Out', 'Successfully logged out of your account.');
        } catch (err) {
            toast.error('Logout Failed', 'Something went wrong while logging out.');
        }
    };

    if (!user) return null;

    const initials = user.username ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <div className="user-dropdown" ref={dropdownRef}>
            <button 
                className="user-dropdown__trigger" 
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <div className="user-dropdown__avatar">{initials}</div>
                <span className="user-dropdown__username">{user.username}</span>
                <svg 
                    className={`user-dropdown__chevron ${isOpen ? 'user-dropdown__chevron--open' : ''}`}
                    xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {isOpen && (
                <div className="user-dropdown__menu">
                    <div className="user-dropdown__header">
                        <p className="user-dropdown__header-name">{user.username}</p>
                        <p className="user-dropdown__header-email">{user.email}</p>
                    </div>
                    <div className="user-dropdown__divider" />
                    <button className="user-dropdown__item user-dropdown__item--logout" onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
