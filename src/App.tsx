import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskType, Habit, Note, GridRow, TaskStatus, AppData } from './types';
import { getWeekDays, formatDate, playSuccessSound, DAYS } from './constants';
import { MainLayout } from './components/layout/MainLayout';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SettingsModal } from './components/layout/SettingsModal';
import { WeekView } from './components/features/board/WeekView';
import { EisenhowerMatrix } from './components/features/dashboard/EisenhowerMatrix';
import { FocusMode } from './components/features/dashboard/FocusMode';
import { AnalyticsDashboard } from './components/features/dashboard/AnalyticsDashboard';
import { PomodoroTimer } from './components/features/tools/PomodoroTimer';
import { HabitTracker } from './components/features/tools/HabitTracker';
import { Notepad } from './components/features/tools/Notepad';

// --- Initial Data ---
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
    { id: 'h1', name: 'Meditation', checks: [false, false, true, false, false, false, false] },
    { id: 'h2', name: 'Reading', checks: [true, false, true, true, false, false, false] },
    { id: 'h3', name: 'Hydration', checks: [false, false, false, false, false, false, false] },
];

const App = () => {
    // --- State ---
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeTab, setActiveTab] = useState<string>('planner');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isStacked, setIsStacked] = useState(false);

    // Pomodoro
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    // Settings
    const [showSettings, setShowSettings] = useState(false);

    // --- Effects ---
    useEffect(() => {
        let interval: number;
        if (isTimerRunning && pomodoroTime > 0) {
            interval = window.setInterval(() => setPomodoroTime(p => p - 1), 1000);
        } else if (pomodoroTime === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, pomodoroTime]);

    // --- Handlers ---
    const addTask = (title: string, duration: number, type: TaskType) => {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            duration,
            type,
            status: 'unscheduled',
            dueDate: null,
            assignedRow: null,
            eisenhowerQuad: null,
            createdAt: Date.now(),
        };
        setTasks([...tasks, newTask]);
    };

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDropOnGrid = (e: React.DragEvent, day: Date, row: GridRow | null) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (!taskId) return;

        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                let targetRow = row;
                let targetType = t.type;

                if (targetRow) {
                    // Dropped on a specific row (Matrix mode)
                    switch (targetRow) {
                        case 'GOAL': targetType = 'high'; break;
                        case 'FOCUS': targetType = 'medium'; break;
                        case 'WORK': targetType = 'low'; break;
                        case 'LEISURE': targetType = 'leisure'; break;
                        case 'CHORES': targetType = 'chores'; break;
                    }
                } else {
                    // Dropped on a day column (Stacked mode)
                    switch (t.type) {
                        case 'high': targetRow = 'GOAL'; break;
                        case 'medium': targetRow = 'FOCUS'; break;
                        case 'low': targetRow = 'WORK'; break;
                        case 'leisure': targetRow = 'LEISURE'; break;
                        case 'chores': targetRow = 'CHORES'; break;
                        case 'backlog':
                        default:
                            targetType = 'medium';
                            targetRow = 'FOCUS';
                            break;
                    }
                }

                return {
                    ...t,
                    status: 'scheduled',
                    dueDate: formatDate(day),
                    assignedRow: targetRow as GridRow,
                    eisenhowerQuad: null,
                    type: targetType
                };
            }
            return t;
        }));
    };

    const handleDropOnSidebar = (e: React.DragEvent) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (!taskId) return;

        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    status: 'unscheduled',
                    dueDate: null,
                    assignedRow: null,
                    eisenhowerQuad: null
                };
            }
            return t;
        }));
    };

    const handleDropOnEisenhower = (e: React.DragEvent, quad: 'do' | 'decide' | 'delegate' | 'delete') => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                return { ...t, status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: quad };
            }
            return t;
        }));
    };

    const toggleHabit = (habitId: string, dayIndex: number) => {
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const newChecks = [...h.checks];
                newChecks[dayIndex] = !newChecks[dayIndex];
                return { ...h, checks: newChecks };
            }
            return h;
        }));
    };

    const toggleTaskComplete = (taskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                const isComplete = t.status === 'completed';
                let newStatus: TaskStatus;

                if (isComplete) {
                    newStatus = (t.dueDate && t.assignedRow) ? 'scheduled' : 'unscheduled';
                } else {
                    newStatus = 'completed';
                    playSuccessSound();
                }
                return { ...t, status: newStatus };
            }
            return t;
        }));
    };

    const exportData = () => {
        const data: AppData = { tasks, habits, notes };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'neuroflow-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData: AppData = JSON.parse(e.target?.result as string);
                    if (importedData.tasks && importedData.habits && importedData.notes) {
                        setTasks(importedData.tasks);
                        setHabits(importedData.habits);
                        setNotes(importedData.notes);
                        alert('Data imported successfully!');
                    } else {
                        throw new Error('Invalid data format.');
                    }
                } catch (error) {
                    console.error('Failed to import data:', error);
                    alert('Failed to import data. Please ensure it is a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleWeekChange = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };

    return (
        <>
            <MainLayout
                sidebar={
                    <Sidebar
                        tasks={tasks}
                        onDragStart={handleDragStart}
                        onDrop={handleDropOnSidebar}
                        onAddTask={addTask}
                        onToggleTaskComplete={toggleTaskComplete}
                        onOpenSettings={() => setShowSettings(true)}
                    />
                }
                header={
                    <Header activeTab={activeTab} setActiveTab={setActiveTab} />
                }
            >
                {activeTab === 'planner' && (
                    <WeekView
                        tasks={tasks}
                        currentDate={currentDate}
                        onWeekChange={handleWeekChange}
                        isStacked={isStacked}
                        setIsStacked={setIsStacked}
                        onDropOnGrid={handleDropOnGrid}
                        onDragStart={handleDragStart}
                        onToggleTaskComplete={toggleTaskComplete}
                    />
                )}
                {activeTab === 'eisenhower' && (
                    <EisenhowerMatrix
                        tasks={tasks}
                        onDragStart={handleDragStart}
                        onDrop={handleDropOnEisenhower}
                        onToggleTaskComplete={toggleTaskComplete}
                    />
                )}
                {activeTab === 'focus' && (
                    <FocusMode
                        tasks={tasks}
                        onDragStart={handleDragStart}
                        onToggleTaskComplete={toggleTaskComplete}
                        onStartFocus={(id) => {
                            setActiveTaskId(id);
                            setIsTimerRunning(true);
                            setActiveTab('pomodoro');
                        }}
                    />
                )}
                {activeTab === 'pomodoro' && (
                    <PomodoroTimer
                        pomodoroTime={pomodoroTime}
                        setPomodoroTime={setPomodoroTime}
                        isTimerRunning={isTimerRunning}
                        setIsTimerRunning={setIsTimerRunning}
                        activeTaskId={activeTaskId}
                        tasks={tasks}
                    />
                )}
                {activeTab === 'habits' && (
                    <HabitTracker
                        habits={habits}
                        toggleHabit={toggleHabit}
                    />
                )}
                {activeTab === 'notes' && (
                    <Notepad notes={notes} />
                )}
                {activeTab === 'analytics' && (
                    <AnalyticsDashboard tasks={tasks} />
                )}
            </MainLayout>

            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                    onExport={exportData}
                    onImport={importData}
                />
            )}
        </>
    );
};

export default App;
