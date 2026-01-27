import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SettingsSectionProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    defaultOpen?: boolean;
    variant?: 'default' | 'danger';
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
    title,
    icon: Icon,
    children,
    defaultOpen = true,
    variant = 'default'
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="rounded-2xl overflow-hidden" style={{
            backgroundColor: variant === 'danger' ? 'rgba(239,68,68,0.03)' : 'var(--bg-surface-subtle)',
            border: `1px solid ${variant === 'danger' ? 'rgba(239,68,68,0.15)' : 'var(--border-light)'}`
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 transition-colors hover:bg-[var(--bg-surface-strong)]"
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} style={{ color: variant === 'danger' ? 'var(--error)' : 'var(--accent)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    style={{ color: 'var(--text-muted)' }}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
