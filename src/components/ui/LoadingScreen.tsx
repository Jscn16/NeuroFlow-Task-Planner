import React, { useEffect } from 'react';

interface LoadingScreenProps {
    message: string;
    onCancel?: () => void;
}

/**
 * Full-screen loading indicator with optional "Continue without sync" button.
 * Automatically hides the HTML app loader when mounted.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, onCancel }) => {
    // Hide the HTML app loader when this screen shows
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <div className="space-y-4 text-center">
                <div className="h-10 w-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white/70">{message}</p>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-white/20 bg-white/5 text-white font-medium hover:border-white/40 hover:bg-white/10 transition-colors"
                    >
                        Continue without sync
                    </button>
                )}
            </div>
        </div>
    );
};
