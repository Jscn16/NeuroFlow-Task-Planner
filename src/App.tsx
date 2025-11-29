import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppData, Task, Habit, BrainDumpList } from './types';
import { getAdjustedDate, getWeekDays, formatDate, INITIAL_TASKS, INITIAL_HABITS } from './constants';
import { MainLayout } from './components/layout/MainLayout';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SettingsModal } from './components/layout/SettingsModal';
import { WeekView } from './components/features/board/WeekView';
import { FocusMode } from './components/features/dashboard/FocusMode';
import { HabitTracker } from './components/features/tools/HabitTracker';
import { BrainDump } from './components/features/tools/BrainDump';
import { themes, getThemeById, applyTheme } from './themes';
import { StorageService } from './services/StorageService';
import { screenTransition } from './utils/animations';

// Hooks
import { useTaskManager } from './hooks/useTaskManager';
import { useHabitManager } from './hooks/useHabitManager';
import { useBrainDumpManager } from './hooks/useBrainDumpManager';
import { usePersistence } from './hooks/usePersistence';

// Lazy load AnalyticsDashboard
const AnalyticsDashboard = React.lazy(() => import('./components/features/dashboard/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));

const App = () => {
    // --- Data Loading ---
    const [initialData, setInitialData] = useState<AppData | null>(() => StorageService.getInstance().load());

    const initialTasksState = initialData?.tasks || INITIAL_TASKS;
    const initialHabitsState = React.useMemo(() =>
        initialData?.habits ? initialData.habits.map(h => ({ ...h, goal: h.goal || 7 })) : INITIAL_HABITS,
        [initialData]);

    // Brain Dump Initialization Logic
    const getInitialBrainDump = (): BrainDumpList[] => {
        if (initialData?.brainDumpLists && initialData.brainDumpLists.length > 0) {
            return initialData.brainDumpLists;
        }
        const legacyContent = initialData?.brainDumpContent || '';
        if (initialData?.notes && initialData.notes.length > 0) {
            return [{ id: '1', title: 'Main List', content: initialData.notes.map(n => n.content).join('\n\n') }];
        }
        return [{ id: '1', title: 'Main List', content: legacyContent }];
    };

    // --- Hooks ---
    const taskManager = useTaskManager(initialTasksState);
    const habitManager = useHabitManager(initialHabitsState);
    const brainDumpManager = useBrainDumpManager(getInitialBrainDump());
    const persistence = usePersistence(taskManager.tasks, habitManager.habits, brainDumpManager.lists);

    // --- UI State ---
    const [activeTab, setActiveTab] = useState<string>('planner');
    const [currentDate, setCurrentDate] = useState(getAdjustedDate());
    const [weekDirection, setWeekDirection] = useState<'next' | 'prev'>('next');
    const [isStacked, setIsStacked] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [viewMode, setViewMode] = useState<'show' | 'fade' | 'hide'>('fade');
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    // --- Theme ---
    const [currentThemeId, setCurrentThemeId] = useState<string>(persistence.loadTheme());

    useEffect(() => {
        const theme = getThemeById(currentThemeId);
        applyTheme(theme);
        persistence.saveTheme(currentThemeId);
    }, [currentThemeId]);

    // --- Global Hotkeys ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                persistence.exportData();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [persistence]);

    // --- App Loader Cleanup ---
    useEffect(() => {
        // Signal that the app is loaded to trigger the fade-out animation in index.html
        const timer = setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100); // Slight delay to ensure React has rendered

        return () => clearTimeout(timer);
    }, []);

    // --- Handlers ---
    const handleWeekChange = (direction: 'prev' | 'next') => {
        setWeekDirection(direction);
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const data = await persistence.importData(e);
        if (data) {
            window.location.reload();
        }
    };

    return (
        <>
            <MainLayout
                sidebar={
                    <Sidebar
                        tasks={taskManager.tasks}
                        onDragStart={taskManager.handleDragStart}
                        onDrop={taskManager.handleDropOnSidebar}
                        onAddTask={taskManager.addTask}
                        onUpdateTask={taskManager.updateTask}
                        onDeleteTask={taskManager.deleteTask}
                        onToggleTaskComplete={taskManager.toggleTaskComplete}
                        onOpenSettings={() => setShowSettings(true)}
                        isOpen={isSidebarOpen}
                        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                        isDragging={taskManager.isDragging}
                        onDragEnd={taskManager.handleDragEnd}
                    />
                }
                header={
                    <Header
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        currentDate={currentDate}
                        onWeekChange={handleWeekChange}
                        isStacked={isStacked}
                        setIsStacked={setIsStacked}
                        isSidebarOpen={isSidebarOpen}
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                }
            >
                <AnimatePresence mode="wait">
                    {activeTab === 'planner' && (
                        <motion.div
                            key="planner"
                            variants={screenTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <WeekView
                                tasks={taskManager.tasks}
                                currentDate={currentDate}
                                weekDirection={weekDirection}
                                isStacked={isStacked}
                                onDropOnGrid={taskManager.handleDropOnGrid}
                                onDragStart={taskManager.handleDragStart}
                                onUpdateTask={taskManager.updateTask}
                                onDeleteTask={taskManager.deleteTask}
                                onToggleTaskComplete={taskManager.toggleTaskComplete}
                                onTaskDrop={taskManager.handleReorderTasks}
                                onDragEnd={taskManager.handleDragEnd}
                                viewMode={viewMode}
                            />
                        </motion.div>
                    )}
                    {activeTab === 'focus' && (
                        <motion.div
                            key="focus"
                            variants={screenTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <FocusMode
                                tasks={taskManager.tasks}
                                onDragStart={taskManager.handleDragStart}
                                onToggleTaskComplete={taskManager.toggleTaskComplete}
                                onStartFocus={setActiveTaskId}
                                onUpdateTask={taskManager.updateTask}
                                showCompleted={viewMode === 'show'}
                            />
                        </motion.div>
                    )}
                    {activeTab === 'habits' && (
                        <motion.div
                            key="habits"
                            variants={screenTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <HabitTracker
                                habits={habitManager.habits}
                                toggleHabit={habitManager.toggleHabit}
                                onDeleteHabit={habitManager.deleteHabit}
                                onAddHabit={habitManager.addHabit}
                            />
                        </motion.div>
                    )}
                    {activeTab === 'braindump' && (
                        <motion.div
                            key="braindump"
                            variants={screenTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <BrainDump
                                lists={brainDumpManager.lists}
                                onUpdateList={brainDumpManager.updateList}
                                onAddList={brainDumpManager.addList}
                                onDeleteList={brainDumpManager.deleteList}
                                onUpdateTitle={brainDumpManager.updateTitle}
                            />
                        </motion.div>
                    )}
                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            variants={screenTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <Suspense fallback={<div className="flex items-center justify-center h-full text-white/50">Loading analytics...</div>}>
                                <AnalyticsDashboard tasks={taskManager.tasks} />
                            </Suspense>
                        </motion.div>
                    )}
                </AnimatePresence>
            </MainLayout>

            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                    onExport={persistence.exportData}
                    onImport={handleImport}
                    onDeleteAllTasks={() => {
                        if (window.confirm('Are you sure you want to delete ALL tasks?')) {
                            taskManager.tasks.forEach(t => taskManager.deleteTask(t.id));
                        }
                    }}
                    onClearRescheduled={taskManager.clearRescheduledTasks}
                    currentThemeId={currentThemeId}
                    onThemeChange={setCurrentThemeId}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
            )}
        </>
    );
};

export default App;
