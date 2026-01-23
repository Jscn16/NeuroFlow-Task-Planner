/**
 * Secure Logger Utility
 * 
 * Wraps console methods to prevent leakage of sensitive information (PII, Secrets, RLS policies)
 * in production environments.
 */

const isDev = import.meta.env.DEV;

export const logger = {
    info: (...args: any[]) => {
        if (isDev) {
            console.log(...args);
        }
    },

    warn: (...args: any[]) => {
        if (isDev) {
            console.warn(...args);
        }
    },

    error: (message: string, error?: any) => {
        if (isDev) {
            console.error(message, error);
        } else {
            // In production, log only the generic message, swallow the full error object
            // to prevent leaking stack traces, DB schema info, or RLS policy violations.
            console.error(message);
        }
    }
};
