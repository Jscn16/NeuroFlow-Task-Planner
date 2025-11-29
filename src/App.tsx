import React, { useState, useEffect, Suspense } from 'react';
import { AppData, Task, Habit, BrainDumpList, DayStats } from './types';
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
    const [isStacked, setIsStacked] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [dayHistory, setDayHistory] = useState<Record<string, DayStats>>({});

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

    // Load dayHistory
    useEffect(() => {
        if (initialData && initialData.dayHistory) {
            setDayHistory(initialData.dayHistory);
        }
    }, [initialData]);

    // Snapshot Logic: Generate stats for past days if missing (Only for PAST WEEKS)
    useEffect(() => {
        const today = getAdjustedDate();

        // Calculate start of the current week (Monday)
        const currentDay = today.getDay(); // 0 is Sunday
        const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const startOfCurrentWeek = new Date(today);
        startOfCurrentWeek.setDate(today.getDate() - daysToMonday);
        startOfCurrentWeek.setHours(0, 0, 0, 0);

        let hasUpdates = false;
        const newHistory = { ...dayHistory };

        // Check the last 30 days to ensure we catch up on any missed snapshots
        for (let i = 1; i <= 30; i++) {
            const pastDay = new Date(startOfCurrentWeek);
            pastDay.setDate(startOfCurrentWeek.getDate() - i);
            const dateStr = formatDate(pastDay);

            // If no snapshot exists for this past-week day
            if (!newHistory[dateStr]) {
                const dayTasks = taskManager.tasks.filter(t => t.dueDate === dateStr && t.status !== 'unscheduled');
                const totalMinutes = dayTasks.reduce((acc, t) => acc + t.duration, 0);
                const completedTasks = dayTasks.filter(t => t.status === 'completed');
                const completedMinutes = completedTasks.reduce((acc, t) => acc + t.duration, 0);

                let percentage = 0;
                if (totalMinutes > 0) {
                    percentage = Math.round((completedMinutes / totalMinutes) * 100);
                }

                newHistory[dateStr] = {
                    date: dateStr,
                    totalMinutes,
                    completedMinutes,
                    percentage
                };
                hasUpdates = true;
            }
        }

        if (hasUpdates) {
            setDayHistory(newHistory);
            // Also update persistence to save this immediately
            // Note: usePersistence handles auto-saving, but we might want to ensure this state is captured
        }
    }, [currentDate, taskManager.tasks, dayHistory]);

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
                        showCompleted={showCompleted}
                        setShowCompleted={setShowCompleted}
                        isSidebarOpen={isSidebarOpen}
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                }
            >
                {activeTab === 'planner' && (
                    <WeekView
                        tasks={taskManager.tasks}
                        currentDate={currentDate}
                        isStacked={isStacked}
                        onDropOnGrid={taskManager.handleDropOnGrid}
                        onDragStart={taskManager.handleDragStart}
                        onUpdateTask={taskManager.updateTask}
                        onDeleteTask={taskManager.deleteTask}
                        onToggleTaskComplete={taskManager.toggleTaskComplete}
                        onTaskDrop={taskManager.handleReorderTasks}
                        showCompleted={showCompleted}
                        dayHistory={dayHistory}
                    />
                )}
                {activeTab === 'focus' && (
                    <FocusMode
                        tasks={taskManager.tasks}
                        onDragStart={taskManager.handleDragStart}
                        onToggleTaskComplete={taskManager.toggleTaskComplete}
                        onStartFocus={setActiveTaskId}
                        onUpdateTask={taskManager.updateTask}
                        showCompleted={showCompleted}
                    />
                )}
                {activeTab === 'habits' && (
                    <HabitTracker
                        habits={habitManager.habits}
                        toggleHabit={habitManager.toggleHabit}
                        onDeleteHabit={habitManager.deleteHabit}
                        onAddHabit={habitManager.addHabit}
                    />
                )}
                {activeTab === 'braindump' && (
                    <BrainDump
                        lists={brainDumpManager.lists}
                        onUpdateList={brainDumpManager.updateList}
                        onAddList={brainDumpManager.addList}
                        onDeleteList={brainDumpManager.deleteList}
                        onUpdateTitle={brainDumpManager.updateTitle}
                    />
                )}
                {activeTab === 'analytics' && (
                    <Suspense fallback={<div className="flex items-center justify-center h-full text-white/50">Loading analytics...</div>}>
                        <AnalyticsDashboard tasks={taskManager.tasks} />
                    </Suspense>
                )}
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
                    currentThemeId={currentThemeId}
                    onThemeChange={setCurrentThemeId}
                />
            )}
        </>
    );
};

export default App;
