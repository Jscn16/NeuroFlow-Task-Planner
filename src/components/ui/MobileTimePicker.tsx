import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock } from 'lucide-react';

interface MobileTimePickerProps {
    isOpen: boolean;
    initialTime?: string; // HH:MM format
    onConfirm: (time: string) => void;
    onClose: () => void;
    onClear?: () => void; // Optional clear button
}

// Generate array of numbers
const range = (start: number, end: number): number[] => {
    const result: number[] = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
};

const HOURS = range(6, 23); // 6 AM to 11 PM
const MINUTES = [0, 15, 30, 45]; // 15-minute intervals

// Format hour for display
const formatHour = (hour: number): string => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h} ${ampm}`;
};

// Format minute for display
const formatMinute = (minute: number): string => {
    return minute.toString().padStart(2, '0');
};

// Wheel picker column component
const WheelColumn: React.FC<{
    items: { value: number; label: string }[];
    selectedValue: number;
    onChange: (value: number) => void;
    width?: string;
}> = ({ items, selectedValue, onChange, width = 'flex-1' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemHeight = 44;
    const visibleItems = 5;
    const centerOffset = Math.floor(visibleItems / 2);

    const scrollToValue = useCallback((value: number, smooth = false) => {
        const index = items.findIndex(item => item.value === value);
        if (index !== -1 && containerRef.current) {
            containerRef.current.scrollTo({
                top: index * itemHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    }, [items, itemHeight]);

    useEffect(() => {
        scrollToValue(selectedValue, false);
    }, [selectedValue, scrollToValue]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
        if (items[clampedIndex]?.value !== selectedValue) {
            onChange(items[clampedIndex].value);
        }
    }, [items, itemHeight, onChange, selectedValue]);

    return (
        <div className={`relative ${width}`} style={{ height: itemHeight * visibleItems }}>
            {/* Selection highlight */}
            <div
                className="absolute left-0 right-0 pointer-events-none z-10"
                style={{
                    top: centerOffset * itemHeight,
                    height: itemHeight,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 8
                }}
            />
            {/* Fade masks */}
            <div
                className="absolute inset-x-0 top-0 z-20 pointer-events-none"
                style={{
                    height: centerOffset * itemHeight,
                    background: 'linear-gradient(to bottom, var(--bg-secondary) 0%, transparent 100%)'
                }}
            />
            <div
                className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
                style={{
                    height: centerOffset * itemHeight,
                    background: 'linear-gradient(to top, var(--bg-secondary) 0%, transparent 100%)'
                }}
            />
            {/* Scroll container */}
            <div
                ref={containerRef}
                className="h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory"
                onScroll={handleScroll}
                style={{ scrollSnapType: 'y mandatory' }}
            >
                {/* Top padding */}
                <div style={{ height: centerOffset * itemHeight }} />
                {items.map((item) => (
                    <div
                        key={item.value}
                        className="flex items-center justify-center snap-center cursor-pointer"
                        style={{ height: itemHeight }}
                        onClick={() => {
                            onChange(item.value);
                            scrollToValue(item.value, true);
                        }}
                    >
                        <span
                            className="text-xl font-bold transition-all"
                            style={{
                                color: item.value === selectedValue ? 'var(--text-primary)' : 'var(--text-muted)',
                                opacity: item.value === selectedValue ? 1 : 0.4
                            }}
                        >
                            {item.label}
                        </span>
                    </div>
                ))}
                {/* Bottom padding */}
                <div style={{ height: centerOffset * itemHeight }} />
            </div>
        </div>
    );
};

export const MobileTimePicker: React.FC<MobileTimePickerProps> = ({
    isOpen,
    initialTime,
    onConfirm,
    onClose,
    onClear
}) => {
    // Parse initial time or default to 9:00
    const parseTime = (time?: string): { hour: number; minute: number } => {
        if (time) {
            const match = time.match(/^(\d{1,2}):(\d{2})$/);
            if (match) {
                const h = parseInt(match[1], 10);
                const m = parseInt(match[2], 10);
                // Round to nearest 15 minutes
                const roundedM = MINUTES.reduce((prev, curr) =>
                    Math.abs(curr - m) < Math.abs(prev - m) ? curr : prev
                );
                return { hour: Math.max(6, Math.min(23, h)), minute: roundedM };
            }
        }
        return { hour: 9, minute: 0 };
    };

    const initial = parseTime(initialTime);
    const [selectedHour, setSelectedHour] = useState(initial.hour);
    const [selectedMinute, setSelectedMinute] = useState(initial.minute);

    // Reset when picker opens
    useEffect(() => {
        if (isOpen) {
            const parsed = parseTime(initialTime);
            setSelectedHour(parsed.hour);
            setSelectedMinute(parsed.minute);
        }
    }, [isOpen, initialTime]);

    const handleConfirm = () => {
        const timeStr = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        onConfirm(timeStr);
    };

    const hourItems = HOURS.map(h => ({ value: h, label: formatHour(h) }));
    const minuteItems = MINUTES.map(m => ({ value: m, label: formatMinute(m) }));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Picker Sheet */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl overflow-hidden"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                            <button
                                onClick={onClose}
                                className="p-2 -m-2 rounded-full"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                <Clock size={18} style={{ color: 'var(--accent)' }} />
                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                    Set Time
                                </span>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className="p-2 -m-2 rounded-full"
                                style={{ color: 'var(--accent)' }}
                            >
                                <Check size={20} />
                            </button>
                        </div>

                        {/* Wheel Pickers */}
                        <div className="flex px-8 py-4">
                            <WheelColumn
                                items={hourItems}
                                selectedValue={selectedHour}
                                onChange={setSelectedHour}
                            />
                            <div className="flex items-center justify-center px-2">
                                <span className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>:</span>
                            </div>
                            <WheelColumn
                                items={minuteItems}
                                selectedValue={selectedMinute}
                                onChange={setSelectedMinute}
                                width="w-24"
                            />
                        </div>

                        {/* Clear Button (optional) */}
                        {onClear && (
                            <div className="px-5 pb-4">
                                <button
                                    onClick={() => {
                                        onClear();
                                        onClose();
                                    }}
                                    className="w-full py-3 rounded-xl text-sm font-semibold"
                                    style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444'
                                    }}
                                >
                                    Remove Time
                                </button>
                            </div>
                        )}

                        {/* Safe area spacer */}
                        <div className="h-6" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

MobileTimePicker.displayName = 'MobileTimePicker';
