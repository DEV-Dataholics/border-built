import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useGiveawayStore } from '../stores/useGiveawayStore';

const CountdownTimer = () => {
    const { t, lang } = useTranslation();
    const { activeGiveaway, loadGiveaways } = useGiveawayStore();

    useEffect(() => {
        if (!activeGiveaway) {
            loadGiveaways();
        }
    }, [activeGiveaway, loadGiveaways]);

    const calculateTimeLeft = useCallback(() => {
        if (!activeGiveaway?.end_date || activeGiveaway.end_date.startsWith('0000')) {
            // Default demo countdown if not configured yet
            return { days: 12, hours: 8, minutes: 45, seconds: 18 };
        }

        // Support both "YYYY-MM-DD HH:mm:ss" and "YYYY-MM-DD"
        const dateStr = activeGiveaway.end_date.includes('T')
            ? activeGiveaway.end_date
            : activeGiveaway.end_date.includes(' ')
                ? activeGiveaway.end_date.replace(' ', 'T')
                : `${activeGiveaway.end_date}T23:59:59`;

        const endDate = new Date(dateStr);
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();

        if (isNaN(diff) || diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60)
        };
    }, [activeGiveaway?.end_date]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const TimeUnit = ({ value, label, animate }) => (
        <div className="flex flex-col items-center gap-2 w-16">
            <div className="relative flex h-16 w-full items-center justify-center rounded bg-gradient-to-b from-[#1a3a1a] to-[#0f240f] border border-primary/30 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
                <p className={`text-white text-2xl font-bold font-mono tracking-tighter ${animate ? 'text-primary animate-pulse' : ''}`}>
                    {value.toString().padStart(2, '0')}
                </p>
                <div className="absolute top-0 w-full h-[1px] bg-white/10"></div>
            </div>
            <p className="text-primary/70 text-[10px] font-bold uppercase tracking-widest">{label}</p>
        </div>
    );

    return (
        <div className="flex gap-3 py-6 px-4 justify-center">
            <TimeUnit value={timeLeft.days} label={lang === 'es' ? 'DÍAS' : 'DAYS'} />
            <span className="text-primary text-2xl font-bold mt-4">:</span>
            <TimeUnit value={timeLeft.hours} label="HRS" />
            <span className="text-primary text-2xl font-bold mt-4">:</span>
            <TimeUnit value={timeLeft.minutes} label="MIN" />
            <span className="text-primary text-2xl font-bold mt-4">:</span>
            <TimeUnit value={timeLeft.seconds} label={lang === 'es' ? 'SEG' : 'SEC'} animate />
        </div>
    );
};

export default CountdownTimer;
