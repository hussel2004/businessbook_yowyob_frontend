'use client';

import { useState, useEffect } from 'react';
import { AdPopup } from './ad-popup';

export function AdPopupWrapper() {
    const [showPopup, setShowPopup] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Check if user has seen the popup recently (stored in localStorage)
        const lastPopupTime = localStorage.getItem('lastAdPopupTime');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // Show popup once per 5 minutes for testing

        if (true) { // Force display for testing // !lastPopupTime || now - parseInt(lastPopupTime) > fiveMinutes
            // Show popup after 2 seconds
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
        localStorage.setItem('lastAdPopupTime', Date.now().toString());
    };

    // Don't render on server
    if (!isMounted) return null;
    if (!showPopup) return null;

    return <AdPopup onClose={handleClose} autoCloseDelay={15000} />;
}
