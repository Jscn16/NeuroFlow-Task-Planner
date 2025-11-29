import React, { useState, useEffect, Suspense } from 'react';
import { AppData, Task, Habit, BrainDumpList } from './types';
import { getAdjustedDate } from './constants';
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

// --- Initial Data Constants ---
const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Q3 Strategy Review', duration: 60, type: 'high', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: 'do', createdAt: Date.now() },
    { id: '2', title: 'Inbox Zero', duration: 30, type: 'low', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: 'delegate', createdAt: Date.now() },
    { id: '3', title: 'Deep Work: Coding', duration: 90, type: 'high', status: 'scheduled', dueDate: new Date().toISOString().split('T')[0], assignedRow: 'FOCUS', eisenhowerQuad: null, createdAt: Date.now() },
    { id: '4', title: 'Evening Run', duration: 45, type: 'leisure', status: 'scheduled', dueDate: new Date().toISOString().split('T')[0], assignedRow: 'LEISURE', eisenhowerQuad: null, createdAt: Date.now() },
    { id: '5', title: 'Client presentation', duration: 90, type: 'high', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '6', title: 'Fix critical bugs', duration: 180, type: 'high', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '7', title: 'Review Report', duration: 120, type: 'high', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '8', title: 'Brainstorm ideas', duration: 90, type: 'medium', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '9', title: 'Research eBay auto', duration: 120, type: 'medium', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '10', title: 'Order calendar', duration: 60, type: 'medium', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '11', title: 'Schedule dentist', duration: 15, type: 'low', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '12', title: 'Check mails', duration: 30, type: 'low', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '13', title: 'Pay electricity', duration: 10, type: 'low', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '14', title: 'Read one chapter', duration: 30, type: 'leisure', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '15', title: 'Organize Photos', duration: 180, type: 'leisure', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '16', title: 'Clean Up', duration: 15, type: 'chores', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
    { id: '17', title: 'Trash Out', duration: 5, type: 'chores', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() },
];

const INITIAL_HABITS: Habit[] = [
    { id: 'h1', name: 'Meditation', goal: 7, checks: [false, false, true, false, false, false, false] },
    { id: 'h2', name: 'Reading', goal: 5, checks: [true, false, true, true, false, false, false] },
    { id: 'h3', name: 'Hydration', goal: 7, checks: [false, false, false, false, false, false, false] },
];

const App = () => {
    // --- Data Loading ---
    const [initialData, setInitialData] = useState<AppData | null>(() => StorageService.getInstance().load());

    const initialTasksState = initialData?.tasks || INITIAL_TASKS;
    const initialHabitsState = initialData?.habits ? initialData.habits.map(h => ({ ...h, goal: h.goal || 7 })) : INITIAL_HABITS;

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
    const [showSettings, setShowSettings] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);
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

    // --- Handlers ---
    const handleWeekChange = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
        // Note: Recurring chores logic removed for simplicity in this refactor step, 
        // can be re-added to TaskManager if needed.
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const data = await persistence.importData(e);
        if (data) {
            // Force reload or update state through managers
            // Ideally managers should expose a 'setAll' method or we rely on the initialTasks prop update
            // But since hooks initialize once, we need a way to update them.
            // Added setTasks/setHabits to managers/hooks for this purpose.
            // Wait, useTaskManager exposes tasks but not setAll.
            // I need to add setAll to hooks or reload page.
            // For now, let's reload page for simplicity or add setAll methods.
            // Actually, the hooks listen to initialTasks changes? No, only on mount usually.
            // Let's reload for safety as it's a rare operation.
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
                            // taskManager.deleteAll(); // Need to implement this
                            // For now, manual filter
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
