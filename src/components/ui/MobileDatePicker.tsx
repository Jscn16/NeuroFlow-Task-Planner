import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface MobileDatePickerProps {
    isOpen: boolean;
    initialDate?: Date;
    onConfirm: (date: Date) => void;
    onClose: () => void;
}

// English month names
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate array of numbers
const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

// Wheel picker column component
const WheelColumn: React.FC<{
    items: { value: number; label: string }[];
    selectedValue: number;
    onChange: (value: number) => void;
    width?: string;
}> = ({ items, selectedValue, onChange, width = 'flex-1' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemHeight = 44;

    // Find initial index
    const selectedIndex = items.findIndex(item => item.value === selectedValue);

    // Scroll to selected item on mount
    useEffect(() => {
        if (containerRef.current && selectedIndex >= 0) {
            containerRef.current.scrollTop = selectedIndex * itemHeight;
        }
    }, [selectedIndex]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
        if (items[clampedIndex] && items[clampedIndex].value !== selectedValue) {
            onChange(items[clampedIndex].value);
        }
    }, [items, selectedValue, onChange]);

    return (
        <div className={`relative ${width}`} style={{ height: itemHeight * 5 }}>
            {/* Selection highlight */}
            <div
                className="absolute left-0 right-0 pointer-events-none z-10"
                style={{
                    top: itemHeight * 2,
                    height: itemHeight,
                    borderTop: '1px solid rgba(34, 211, 238, 0.3)',
                    borderBottom: '1px solid rgba(34, 211, 238, 0.3)',
                    background: 'rgba(34, 211, 238, 0.1)'
                }}
            />

            {/* Fade gradients */}
            <div
                className="absolute inset-x-0 top-0 h-20 pointer-events-none z-20"
                style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)' }}
            />
            <div
                className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-20"
                style={{ background: 'linear-gradient(to top, var(--bg-secondary), transparent)' }}
            />

            {/* Scrollable items */}
            <div
                ref={containerRef}
                className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
                onScroll={handleScroll}
                style={{ scrollSnapType: 'y mandatory' }}
            >
                {/* Top padding */}
                <div style={{ height: itemHeight * 2 }} />

                {items.map((item) => (
                    <div
                        key={item.value}
                        className="flex items-center justify-center snap-center"
                        style={{
                            height: itemHeight,
                            color: item.value === selectedValue ? 'var(--accent)' : 'var(--text-muted)',
                            fontWeight: item.value === selectedValue ? 600 : 400,
                            fontSize: item.value === selectedValue ? '1.1rem' : '0.95rem',
                            transition: 'all 0.15s ease'
                        }}
                        onClick={() => {
                            onChange(item.value);
                            if (containerRef.current) {
                                const index = items.findIndex(i => i.value === item.value);
                                containerRef.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
                            }
                        }}
                    >
                        {item.label}
                    </div>
                ))}

                {/* Bottom padding */}
                <div style={{ height: itemHeight * 2 }} />
            </div>
        </div>
    );
};

export const MobileDatePicker: React.FC<MobileDatePickerProps> = ({
    isOpen,
    initialDate,
    onConfirm,
    onClose
}) => {
    const today = new Date();
    const initial = initialDate || today;

    const [day, setDay] = useState(initial.getDate());
    const [month, setMonth] = useState(initial.getMonth() + 1); // 1-indexed
    const [year, setYear] = useState(initial.getFullYear());

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            const d = initialDate || new Date();
            setDay(d.getDate());
            setMonth(d.getMonth() + 1);
            setYear(d.getFullYear());
        }
    }, [isOpen, initialDate]);

    // Calculate valid days for current month/year
    const daysInMonth = new Date(year, month, 0).getDate();
    const validDay = Math.min(day, daysInMonth);

    // Generate options
    const dayItems = range(1, daysInMonth).map(d => ({
        value: d,
        label: d.toString().padStart(2, '0')
    }));

    const monthItems = MONTHS.map((name, i) => ({
        value: i + 1,
        label: name
    }));

    const yearItems = range(today.getFullYear(), today.getFullYear() + 2).map(y => ({
        value: y,
        label: y.toString()
    }));

    const handleConfirm = () => {
        const selectedDate = new Date(year, month - 1, validDay);
        onConfirm(selectedDate);
    };

    // Format preview date (English style)
    const previewDate = `${MONTHS[month - 1]} ${validDay}, ${year}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/70 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Picker */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl overflow-hidden"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full"
                                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                            >
                                <X size={20} style={{ color: 'var(--text-muted)' }} />
                            </button>

                            <div className="text-center">
                                <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Select Date
                                </div>
                                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {previewDate}
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                className="p-2 rounded-full"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                <Check size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Wheel Columns - German order: Day, Month, Year */}
                        <div className="flex px-4 py-2" style={{ height: 240 }}>
                            <WheelColumn
                                items={dayItems}
                                selectedValue={validDay}
                                onChange={setDay}
                                width="w-20"
                            />
                            <WheelColumn
                                items={monthItems}
                                selectedValue={month}
                                onChange={setMonth}
                            />
                            <WheelColumn
                                items={yearItems}
                                selectedValue={year}
                                onChange={setYear}
                                width="w-24"
                            />
                        </div>

                        {/* Safe area */}
                        <div className="h-8" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

MobileDatePicker.displayName = 'MobileDatePicker';
