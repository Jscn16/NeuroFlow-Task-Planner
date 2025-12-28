import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, GripVertical, MousePointer2, Plus, CalendarDays } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface FirstTaskGuideProps {
    onComplete: () => void;
    hasAnyTasks: boolean;
    hasScheduledTask?: boolean; // True when any task has a dueDate
    isSidebarOpen?: boolean;
}

// Mobile has more granular steps for better guidance
type MobileGuideStep = 'tap-fab' | 'add-form' | 'tap-task' | 'done';
// Desktop keeps the original simpler flow
type DesktopGuideStep = 'type' | 'drag' | 'done';
type GuideStep = MobileGuideStep | DesktopGuideStep;

const STORAGE_KEY = 'neuroflow_first_task_guide_completed';

export const FirstTaskGuide: React.FC<FirstTaskGuideProps> = ({ onComplete, hasAnyTasks, hasScheduledTask = false, isSidebarOpen = false }) => {
    const isMobile = useIsMobile();
    const [isCompleted, setIsCompleted] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true';
        } catch {
            return false;
        }
    });

    // Initialize step - will be corrected by effect below based on isMobile
    const [step, setStep] = useState<GuideStep>('type');
    const [visible, setVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [taskCreatedDuringSession, setTaskCreatedDuringSession] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [taskClicked, setTaskClicked] = useState(false); // Hide highlight when task is clicked

    // Sync step with device type - isMobile might be false initially then become true
    useEffect(() => {
        if (!initialized && !hasAnyTasks) {
            setStep(isMobile ? 'tap-fab' : 'type');
            setInitialized(true);
        }
    }, [isMobile, hasAnyTasks, initialized]);

    // Don't show if already completed
    useEffect(() => {
        if (!isCompleted && !hasAnyTasks) {
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [isCompleted, hasAnyTasks]);

    // Mobile: When sidebar opens, move to add-form step
    useEffect(() => {
        if (isMobile && step === 'tap-fab' && isSidebarOpen) {
            setStep('add-form');
        }
    }, [isMobile, step, isSidebarOpen]);

    // Track task creation - transition to tap-task step on mobile
    useEffect(() => {
        if (hasAnyTasks && !taskCreatedDuringSession) {
            setTaskCreatedDuringSession(true);
            if (isMobile) {
                // When task is created, move to tap-task step
                if (step === 'add-form' || step === 'tap-fab') {
                    setStep('tap-task');
                }
            } else {
                // Desktop: move to drag step
                if (step === 'type') {
                    setStep('drag');
                }
            }
        }
    }, [hasAnyTasks, step, isMobile, taskCreatedDuringSession]);

    // Find target element for current step
    useEffect(() => {
        const findTarget = () => {
            let selector = '';

            if (isMobile) {
                // Mobile-specific selectors
                switch (step) {
                    case 'tap-fab':
                        selector = '[aria-label="Add task"]';
                        break;
                    case 'add-form':
                        selector = '[data-tour="add-task"]';
                        break;
                    case 'tap-task':
                        // Look for task cards in sidebar list OR day view
                        selector = '[data-tour="brain-dump"] [data-task-card], .task-card-mobile';
                        break;
                }
            } else {
                // Desktop selectors
                if (step === 'type') {
                    selector = '[data-tour="add-task"] input';
                } else if (step === 'drag') {
                    selector = '[data-tour="brain-dump"] [draggable="true"]';
                }
            }

            if (selector) {
                const target = document.querySelector(selector);
                if (target) {
                    setTargetRect(target.getBoundingClientRect());
                }
            }
        };

        const timer = setTimeout(findTarget, 300);
        window.addEventListener('resize', findTarget);
        const interval = setInterval(findTarget, 500); // Keep updating position

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            window.removeEventListener('resize', findTarget);
        };
    }, [step, isMobile]);

    const handleComplete = useCallback(() => {
        setVisible(false);
        setIsCompleted(true);
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
        } catch { }
        onComplete();
    }, [onComplete]);

    const handleSkip = useCallback(() => {
        handleComplete();
    }, [handleComplete]);

    // Listen for completion triggers
    useEffect(() => {
        if (isMobile) {
            // Mobile: complete tap-task step when user ACTUALLY SCHEDULES a task (gets dueDate)
            if (step === 'tap-task' && hasScheduledTask) {
                setStep('done');
                // Don't auto-complete - wait for user to click "Okay" button
            }

            // Hide highlight when user clicks a task (but keep tooltip visible)
            if (step === 'tap-task' && !taskClicked) {
                const handleTaskTap = (e: Event) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-task-card]')) {
                        setTaskClicked(true);
                    }
                };
                document.addEventListener('click', handleTaskTap);
                return () => document.removeEventListener('click', handleTaskTap);
            }
        } else {
            // Desktop: complete when task is scheduled (dropped on grid)
            if (step === 'drag') {
                const checkForScheduledTask = () => {
                    const scheduledTasks = document.querySelectorAll('[data-tour="week-view"] [draggable="true"]');
                    if (scheduledTasks.length > 0) {
                        setStep('done');
                        setTimeout(() => handleComplete(), 2000);
                    }
                };

                const interval = setInterval(checkForScheduledTask, 500);
                return () => clearInterval(interval);
            }
        }
    }, [step, isMobile, hasScheduledTask, taskClicked, handleComplete]);

    if (isCompleted || !visible) return null;

    const getTooltipContent = () => {
        if (isMobile) {
            // Mobile-specific content with more guidance
            switch (step) {
                case 'tap-fab':
                    return {
                        icon: <Plus size={20} className="text-cyan-400" />,
                        title: 'Tap the + button',
                        description: 'Open the sidebar to create your first task',
                        showPulse: true
                    };
                case 'add-form':
                    return {
                        icon: <Sparkles size={20} className="text-amber-400" />,
                        title: 'Create your first task',
                        description: 'Type your task, select a priority, and tap "Add Task"',
                        showPulse: true
                    };
                case 'tap-task':
                    return {
                        icon: <CalendarDays size={20} className="text-cyan-400" />,
                        title: 'Now schedule it!',
                        description: 'Tap on your task to choose a date for it',
                        showPulse: true
                    };
                case 'done':
                    return {
                        icon: <Check size={20} className="text-emerald-400" />,
                        title: 'You\'re all set!',
                        description: 'Explore the app and stay productive',
                        showPulse: false
                    };
                default:
                    return {
                        icon: <Plus size={20} className="text-cyan-400" />,
                        title: 'Tap the + button',
                        description: 'Open the sidebar to create your first task',
                        showPulse: true
                    };
            }
        }

        // Desktop content
        switch (step) {
            case 'type':
                return {
                    icon: <Sparkles size={20} className="text-amber-400" />,
                    title: 'Create your first task',
                    description: 'Type something like "Plan my day" and press Enter',
                    showPulse: true
                };
            case 'drag':
                return {
                    icon: <GripVertical size={20} className="text-cyan-400" />,
                    title: 'Now drag it to your schedule',
                    description: 'Grab your task and drop it onto any day in the planner',
                    showPulse: true
                };
            case 'done':
                return {
                    icon: <Check size={20} className="text-emerald-400" />,
                    title: 'Perfect! You\'re all set',
                    description: 'You just learned the core workflow. Keep going!',
                    showPulse: false
                };
            default:
                return {
                    icon: <Sparkles size={20} className="text-amber-400" />,
                    title: 'Create your first task',
                    description: 'Type something like "Plan my day" and press Enter',
                    showPulse: true
                };
        }
    };

    const content = getTooltipContent();
    const PAD = 16;

    // Get the current mobile step index for progress dots
    const getMobileStepIndex = (): number => {
        switch (step) {
            case 'tap-fab': return 0;
            case 'add-form': return 1;
            case 'tap-task': return 2;
            case 'done': return 3;
            default: return 0;
        }
    };

    // Calculate tooltip position
    const getTooltipStyle = (): React.CSSProperties => {
        // Mobile: position at TOP of screen to avoid obscuring FAB and navigation
        if (isMobile) {
            if (step === 'add-form' && targetRect) {
                // Position below the add-task form in sidebar
                return {
                    top: Math.min(targetRect.bottom + PAD, window.innerHeight - 200),
                    left: 16,
                    right: 16,
                    transform: 'none'
                };
            }
            // For tap-fab and tap-task steps, position at TOP of screen
            // This avoids obscuring the FAB button and bottom nav
            return {
                top: 80,  // Below header area
                left: 16,
                right: 16,
                transform: 'none'
            };
        }

        // Desktop positioning
        if (!targetRect) {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            };
        }

        if (step === 'type') {
            return {
                top: targetRect.bottom + PAD,
                left: targetRect.left + targetRect.width / 2,
                transform: 'translateX(-50%)'
            };
        } else if (step === 'drag') {
            return {
                top: targetRect.top + targetRect.height / 2,
                left: targetRect.right + PAD + 8,
                transform: 'translateY(-50%)'
            };
        }

        return {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        };
    };

    const totalMobileSteps = 3; // tap-fab, add-form, tap-task (done doesn't count)

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9997] pointer-events-none"
                >
                    {/* Pulsing ring around target - hide if task was clicked during tap-task step */}
                    {targetRect && content.showPulse && !(step === 'tap-task' && taskClicked) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute pointer-events-none"
                            style={{
                                top: targetRect.top - 6,
                                left: targetRect.left - 6,
                                width: targetRect.width + 12,
                                height: targetRect.height + 12,
                                borderRadius: 12
                            }}
                        >
                            {/* Pulsing animation */}
                            <motion.div
                                className="absolute inset-0 rounded-xl border-2 border-cyan-400"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.8, 0.4, 0.8]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            {/* Glow */}
                            <div
                                className="absolute inset-0 rounded-xl"
                                style={{
                                    boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Tooltip */}
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed z-[10000] pointer-events-auto"
                        style={{ ...getTooltipStyle(), width: isMobile ? 'auto' : 280 }}
                    >
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: 'var(--bg-secondary)',
                                backdropFilter: 'blur(40px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                                border: '1px solid var(--border-medium)',
                                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <div className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: 'var(--accent-muted)',
                                            border: '1px solid var(--border-light)'
                                        }}
                                    >
                                        {content.icon}
                                    </div>
                                    <div>
                                        <h4
                                            className="text-[15px] font-semibold mb-1"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {content.title}
                                        </h4>
                                        <p
                                            className="text-[13px] leading-relaxed"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {content.description}
                                        </p>
                                    </div>
                                </div>

                                {step === 'done' && isMobile ? (
                                    // Mobile "done" step: show Okay button
                                    <div
                                        className="flex justify-end pt-3"
                                        style={{ borderTop: '1px solid var(--border-light)' }}
                                    >
                                        <button
                                            onClick={handleComplete}
                                            className="px-5 py-2 rounded-lg text-[14px] font-medium transition-all"
                                            style={{
                                                color: 'var(--text-primary)',
                                                background: 'var(--accent)',
                                            }}
                                        >
                                            Okay
                                        </button>
                                    </div>
                                ) : step !== 'done' && (
                                    <div
                                        className="flex items-center justify-between pt-2"
                                        style={{ borderTop: '1px solid var(--border-light)' }}
                                    >
                                        <button
                                            onClick={handleSkip}
                                            className="text-[12px] transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            Skip tutorial
                                        </button>

                                        {/* Progress dots */}
                                        <div className="flex gap-1.5">
                                            {isMobile ? (
                                                // Mobile: 3 dots for tap-fab, add-form, tap-task
                                                Array.from({ length: totalMobileSteps }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{
                                                            background: i <= getMobileStepIndex()
                                                                ? 'var(--accent)'
                                                                : 'var(--border-medium)'
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                // Desktop: 2 dots for type, drag
                                                <>
                                                    <div
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{ background: step === 'type' ? 'var(--accent)' : 'var(--accent-muted)' }}
                                                    />
                                                    <div
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{ background: step === 'drag' ? 'var(--accent)' : 'var(--border-medium)' }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Arrow pointer */}
                        {step === 'type' && targetRect && (
                            <div
                                className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
                                style={{
                                    borderLeft: '8px solid transparent',
                                    borderRight: '8px solid transparent',
                                    borderBottom: '8px solid var(--bg-secondary)'
                                }}
                            />
                        )}
                    </motion.div>

                    {/* Drag animation hint - desktop only */}
                    {!isMobile && step === 'drag' && targetRect && (
                        <motion.div
                            className="fixed pointer-events-none"
                            initial={{ opacity: 0, x: 0, y: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                x: [0, 100, 200, 200],
                                y: [0, -20, 0, 0]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                            style={{
                                top: targetRect.top + targetRect.height / 2 - 12,
                                left: targetRect.left + targetRect.width / 2 - 12
                            }}
                        >
                            <MousePointer2 size={24} className="text-white/60" />
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
