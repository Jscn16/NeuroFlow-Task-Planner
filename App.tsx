
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, Target, Timer, ListChecks, Notebook, BarChart3, 
  ChevronLeft, ChevronRight, Plus, Play, Pause, X, RotateCcw, CalendarDays, Flame,
  ArrowRight, Cog, Sparkles, Settings, CheckCircle2, Briefcase, Gamepad2, Brush,
  Layers
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { Task, GridRow, TaskType, Habit, Note, ROW_LABELS, DAYS, TaskStatus } from './types';
import { TYPE_COLORS, getWeekDays, formatDate, playSuccessSound, TARGET_HOURS_PER_DAY } from './constants';
import { TaskCard } from './components/TaskCard';

// --- Types & Constants ---

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

interface AppData {
    tasks: Task[];
    habits: Habit[];
    notes: Note[];
}

// Enhanced Row Configuration with Icons and Subtitles - Using Flex weights for dynamic scaling
// Reduced min-heights to fit more on screen
const ROW_CONFIG: Record<GridRow, { 
    label: string, 
    sub: string, 
    icon: React.ElementType, 
    color: string, 
    barColor: string, 
    flexClass: string,
    description: string
}> = {
    'GOAL':    { label: 'GOAL',    sub: 'High impact',   icon: Target,       color: 'text-rose-400',   barColor: 'bg-rose-500',   flexClass: 'flex-[1] min-h-[70px]', description: 'One major objective that moves the needle.' },
    'FOCUS':   { label: 'FOCUS',   sub: 'Deep work',     icon: Flame,      color: 'text-orange-400', barColor: 'bg-orange-500', flexClass: 'flex-[3] min-h-[100px]', description: ' uninterrupted blocks for complex tasks.' },
    'WORK':    { label: 'WORK',    sub: 'Business',      icon: Briefcase,  color: 'text-amber-400',  barColor: 'bg-amber-400',  flexClass: 'flex-[3] min-h-[100px]', description: 'Standard operational tasks and meetings.' },
    'LEISURE': { label: 'LEISURE', sub: 'Recharge',      icon: Gamepad2,   color: 'text-cyan-400',   barColor: 'bg-cyan-400',   flexClass: 'flex-[3] min-h-[100px]', description: 'Time to rest, play, and recover.' },
    'CHORES':  { label: 'CHORES',  sub: 'Life admin',    icon: Brush,      color: 'text-slate-400',  barColor: 'bg-slate-500',  flexClass: 'flex-[3] min-h-[100px]', description: 'Maintenance, errands, and cleaning.' },
};

// Sidebar Categories - Renamed labels per request
const SIDEBAR_CATEGORIES = [
    { id: 'high', label: 'ASAP · High Prio', color: 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' },
    { id: 'medium', label: 'Soon · Medium Prio', color: 'bg-orange-500 text-white' },
    { id: 'low', label: 'Later · Low Prio', color: 'bg-amber-400 text-black' },
    { id: 'leisure', label: 'Leisure', color: 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' },
    { id: 'backlog', label: 'BACKLOG', color: 'bg-slate-600 text-slate-200' },
    { id: 'chores', label: 'Chores', color: 'bg-zinc-500 text-white' }, // Renamed from BASICS
];

// --- Added GridCell Component ---
interface GridCellProps {
  day: Date;
  row: GridRow;
  isToday: boolean;
  tasks: Task[];
  onDrop: (e: React.DragEvent, day: Date, row: GridRow) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  isDayEmpty: boolean; // New prop for empty day fading
}

const GridCell: React.FC<GridCellProps> = ({ day, row, isToday, tasks, onDrop, onDragStart, onToggleComplete, isDayEmpty }) => {
  const dayStr = formatDate(day);
  const cellTasks = tasks.filter(t => t.status !== 'unscheduled' && t.dueDate === dayStr && t.assignedRow === row);
  
  // Define visual slots per category
  const slotCount = row === 'GOAL' ? 1 : 3;
  
  // Render tasks up to the slotCount
  const visibleTasks = cellTasks.slice(0, slotCount);
  const emptySlotsToRender = slotCount - visibleTasks.length;

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, day, row)}
      title={`${ROW_CONFIG[row].label}: ${ROW_CONFIG[row].description}`}
      className={`
        relative flex-1 w-0 transition-all duration-300 group/cell
        /* Active Day Column Effect */
        ${isToday 
            ? 'border-l border-r border-cyan-500/20 bg-cyan-500/[0.02]' 
            : 'border-r border-white/[0.05] last:border-r-0 bg-transparent'
        }
        hover:bg-white/[0.02]
        flex flex-col p-1 gap-1
      `}
    >
      {/* Render actual tasks */}
      {visibleTasks.map(task => (
          <TaskCard 
              key={task.id} 
              task={task} 
              variant="board" // Always board variant for grid
              onDragStart={onDragStart}
              onToggleComplete={onToggleComplete}
          />
      ))}

      {/* Render ghost slots if needed */}
      {emptySlotsToRender > 0 && Array.from({ length: emptySlotsToRender }).map((_, index) => (
          <div 
            key={`ghost-${index}`} 
            className={`
              flex-1 relative w-full group/slot min-h-0
              ${row === 'GOAL' ? 'min-h-[4rem]' : 'min-h-[3rem]'}
          `}>
              <div className={`
                  absolute inset-0 rounded-lg border-2 border-dashed
                  bg-transparent flex items-center justify-center transition-all duration-300
                  ${isDayEmpty 
                    ? 'border-slate-700/5' // Extra faded for empty days
                    : 'border-slate-700/10 group-hover/slot:border-slate-600/50 group-hover/slot:bg-slate-800/50' // Normal idle/hover
                  }
              `}>
                  <Plus size={16} className={`text-slate-600/30 transition-opacity ${isDayEmpty ? 'opacity-0' : 'opacity-0 group-hover/slot:opacity-100'}`} />
              </div>
          </div>
      ))}
    </div>
  );
};

const App = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<string>('planner');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(30);
  const [newTaskType, setNewTaskType] = useState<TaskType>('backlog');

  // UI State
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
      'high': true, 'medium': true, 'low': false, 'leisure': false, 'backlog': true, 'chores': false
  });
  const [isStacked, setIsStacked] = useState(false);

  // Pomodoro
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Settings
  const [showSettings, setShowSettings] = useState(false);

  // Derived
  const currentWeekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const todayStr = formatDate(new Date());

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
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      duration: newTaskDuration,
      type: newTaskType,
      status: 'unscheduled',
      dueDate: null,
      assignedRow: null,
      eisenhowerQuad: null,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    // Ensure the category being added to is expanded
    setExpandedCategories(prev => ({...prev, [newTaskType]: true}));
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

  const toggleCategory = (catId: string) => {
      setExpandedCategories(prev => ({...prev, [catId]: !prev[catId]}));
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

  // --- Helper Components ---

  const SettingsModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-3xl border border-white/[0.1] rounded-[2rem] p-8 w-96 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-display font-bold text-white mb-8 drop-shadow-md flex items-center gap-3">
            <Cog className="text-cyan-400" /> Settings
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Data Management</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={exportData} 
                className="w-full text-left px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:border-cyan-500/30 transition-all"
              >
                Export Data (.json)
              </button>
              <label className="w-full text-left px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between group">
                <span>Import Data (.json)</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Additional Views ---

  const renderEisenhower = () => {
    const quadrants = [
        { id: 'do', label: 'Do', sub: 'Urgent & Important', color: 'bg-rose-500', border: 'border-rose-500/30' },
        { id: 'decide', label: 'Decide', sub: 'Not Urgent & Important', color: 'bg-orange-500', border: 'border-orange-500/30' },
        { id: 'delegate', label: 'Delegate', sub: 'Urgent & Not Important', color: 'bg-amber-400', border: 'border-amber-400/30' },
        { id: 'delete', label: 'Delete', sub: 'Not Urgent & Not Important', color: 'bg-slate-500', border: 'border-slate-500/30' },
    ];

    return (
        <div className="flex h-full p-8 gap-6 overflow-hidden">
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-6">
                {quadrants.map(q => (
                    <div 
                        key={q.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnEisenhower(e, q.id as any)}
                        className={`
                            relative rounded-3xl border ${q.border} bg-white/[0.02] p-6 flex flex-col
                            backdrop-blur-sm transition-all hover:bg-white/[0.04]
                        `}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className={`text-2xl font-display font-bold ${q.color} bg-clip-text text-transparent`}>{q.label}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{q.sub}</p>
                            </div>
                            <div className={`p-2 rounded-full ${q.color} bg-opacity-20`}>
                                <div className={`w-2 h-2 rounded-full ${q.color}`}></div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                            {tasks.filter(t => t.eisenhowerQuad === q.id).map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    variant="sidebar" // Eisenhower tasks are essentially backlog
                                    onDragStart={handleDragStart}
                                    onToggleComplete={toggleTaskComplete}
                                />
                            ))}
                            {tasks.filter(t => t.eisenhowerQuad === q.id).length === 0 && (
                                <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderFocus = () => {
    const focusTasks = tasks.filter(t => 
        (t.status === 'scheduled' && t.dueDate === todayStr) ||
        (t.status === 'unscheduled' && t.type === 'high')
    );

    return (
        <div className="h-full p-8 flex flex-col">
            <h2 className="text-3xl font-display font-bold text-white mb-6">Deep Focus Mode</h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                {focusTasks.map(task => (
                    <div key={task.id} className="relative group">
                         <TaskCard 
                            task={task} 
                            variant="sidebar" // Focus tasks here are like special backlog
                            onDragStart={handleDragStart}
                            onToggleComplete={toggleTaskComplete}
                            onStartFocus={(id) => {
                                setActiveTaskId(id);
                                setIsTimerRunning(true);
                                setActiveTab('pomodoro');
                            }}
                        />
                    </div>
                ))}
                {focusTasks.length === 0 && (
                     <div className="text-center py-20 text-slate-500">No focus tasks for today. Check your schedule!</div>
                )}
            </div>
        </div>
    );
  };

  const renderPomodoro = () => {
     const activeTask = tasks.find(t => t.id === activeTaskId);
     const progress = 1 - (pomodoroTime / (25 * 60));

     return (
         <div className="h-full flex items-center justify-center p-8 flex-col">
             <div className="relative w-96 h-96 flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" className="text-slate-700/30" fill="transparent" />
                     <circle 
                        cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" 
                        className="text-cyan-400 transition-all duration-1000" 
                        fill="transparent"
                        strokeDasharray="283%"
                        strokeDashoffset={`${283 * (1 - progress)}%`}
                        strokeLinecap="round"
                     />
                 </svg>
                 
                 <div className="text-center z-10">
                    <div className="text-8xl font-mono font-bold text-white tracking-tighter mb-4">
                        {formatTime(pomodoroTime)}
                    </div>
                    {activeTask ? (
                        <div className="text-slate-400 text-lg max-w-[200px] mx-auto truncate animate-pulse">
                            Focusing on: <br/> <span className="text-cyan-300 font-bold">{activeTask.title}</span>
                        </div>
                    ) : (
                        <div className="text-slate-500">Select a task to focus</div>
                    )}
                 </div>
             </div>
             
             <div className="flex gap-6 mt-12">
                 <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-6 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300 transition-all scale-100 hover:scale-110 active:scale-95"
                 >
                     {isTimerRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1"/>}
                 </button>
                 <button 
                    onClick={() => { setPomodoroTime(25*60); setIsTimerRunning(false); }}
                    className="p-6 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-300 transition-all scale-100 hover:scale-110 active:scale-95"
                 >
                     <RotateCcw size={32} />
                 </button>
             </div>
         </div>
     );
  };

  const renderHabits = () => {
    return (
        <div className="h-full p-8 overflow-y-auto">
             <h2 className="text-3xl font-display font-bold text-white mb-8">Habit Tracker</h2>
             <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 overflow-x-auto">
                 <table className="w-full">
                     <thead>
                         <tr>
                             <th className="text-left py-4 px-4 text-slate-500 uppercase text-xs tracking-wider">Habit</th>
                             {DAYS.map(d => (
                                 <th key={d} className="text-center py-4 px-2 text-slate-500 uppercase text-xs tracking-wider">{d}</th>
                             ))}
                             <th className="text-center py-4 px-4 text-slate-500 uppercase text-xs tracking-wider">Streak</th>
                         </tr>
                     </thead>
                     <tbody>
                         {habits.map(habit => {
                             const streak = habit.checks.filter(Boolean).length;
                             return (
                                 <tr key={habit.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                     <td className="py-4 px-4 font-bold text-slate-200">{habit.name}</td>
                                     {habit.checks.map((checked, i) => (
                                         <td key={i} className="py-4 px-2 text-center">
                                             <button 
                                                onClick={() => toggleHabit(habit.id, i)}
                                                className={`
                                                    w-8 h-8 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto
                                                    ${checked 
                                                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110' 
                                                        : 'bg-white/[0.05] text-transparent hover:bg-white/[0.1]'
                                                    }
                                                `}
                                             >
                                                 <CheckCircle2 size={16} strokeWidth={4} />
                                             </button>
                                         </td>
                                     ))}
                                     <td className="py-4 px-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-white/[0.05] text-xs font-bold text-slate-300">{streak} / 7</span>
                                     </td>
                                 </tr>
                             )
                         })}
                     </tbody>
                 </table>
                 
                 <div className="mt-8 flex gap-3">
                     <input type="text" placeholder="New Habit..." className="bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500" />
                     <button className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-sm uppercase hover:bg-cyan-500/30 transition-all">Add</button>
                 </div>
             </div>
        </div>
    );
  };
  
  const renderNotes = () => {
      return (
          <div className="h-full p-8 flex flex-col">
              <h2 className="text-3xl font-display font-bold text-white mb-6">Journal & Notes</h2>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                   <div className="aspect-[4/5] rounded-3xl border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                        <Plus size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-xs">New Entry</span>
                   </div>
                   
                   <div className="aspect-[4/5] rounded-3xl bg-amber-100/10 border border-amber-200/20 p-6 flex flex-col relative group hover:scale-[1.02] transition-transform duration-300">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/60 mb-3">Today</span>
                        <h3 className="text-xl font-bold text-amber-100 mb-2">Morning Thoughts</h3>
                        <p className="text-sm text-amber-100/70 leading-relaxed">
                            Focus on the Q3 review today. Need to ensure all metrics are aligned. Don't forget to call mom later.
                        </p>
                        <div className="mt-auto pt-4 border-t border-white/[0.1] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 hover:bg-white/[0.1] rounded-full"><Sparkles size={14} /></button>
                             <span className="text-[10px] text-amber-200/40">10:42 AM</span>
                        </div>
                   </div>
              </div>
          </div>
      );
  };

  const renderAnalytics = () => {
      const tasksByType = tasks.reduce((acc, task) => {
          acc[task.type] = (acc[task.type] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);
      
      const chartData = Object.keys(tasksByType).map(type => ({
          name: type,
          count: tasksByType[type],
          color: TYPE_COLORS[type as TaskType].includes('red') ? '#f43f5e' : 
                 TYPE_COLORS[type as TaskType].includes('orange') ? '#f97316' : 
                 TYPE_COLORS[type as TaskType].includes('yellow') ? '#fbbf24' : 
                 TYPE_COLORS[type as TaskType].includes('cyan') ? '#22d3ee' : 
                 TYPE_COLORS[type as TaskType].includes('zinc') ? '#e4e4e7' : '#94a3b8'
      }));

      return (
          <div className="h-full p-8 overflow-y-auto">
               <h2 className="text-3xl font-display font-bold text-white mb-8">Productivity Analytics</h2>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 h-80">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Task Distribution</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} 
                                    itemStyle={{ color: '#e4e4e7' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                   </div>
                   
                   <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 h-80 flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 flex items-center justify-center mb-4">
                             <div className="text-3xl font-bold text-white">{tasks.filter(t => t.status === 'completed').length}</div>
                        </div>
                        <h3 className="text-lg font-bold text-white">Tasks Completed</h3>
                        <p className="text-sm text-slate-500">Total Lifetime</p>
                   </div>
               </div>
          </div>
      );
  };

  const renderGlassSidebar = () => {
    // Reverted to Screenshot Layout:
    // Row 1: Input + Duration
    // Row 2: ASAP, SOON, LATER
    // Row 3: LEISURE, BACKLOG, BASICS
    // Row 4: Add Button

    return (
        <div 
            className="w-64 h-full flex flex-col border-r border-white/[0.05] bg-[#1a1f35]/90 backdrop-blur-2xl relative z-20 shadow-2xl"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnSidebar}
        >
            {/* Logo Area */}
            <div className="p-4 pb-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-xl bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <LayoutGrid size={16} className="text-white" />
                    </div>
                    <h1 className="text-xl font-display font-bold tracking-tight text-white">
                        Neuro<span className="text-cyan-400">Flow</span>
                    </h1>
                </div>
                <p className="text-[10px] text-slate-400 font-medium ml-9">ADHD Productivity OS</p>
            </div>

            {/* Quick Add Task - Reconstructed to Match Screenshot */}
            <div className="p-4 border-b border-white/[0.05]">
                {/* Row 1: Inputs */}
                <div className="flex gap-2 mb-2">
                     <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        placeholder="New Task..." 
                        className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                    <div className="relative w-20">
                         <input 
                            type="number"
                            value={newTaskDuration}
                            onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                            className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg pl-3 pr-6 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500/50 transition-all text-right"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-500">min</span>
                    </div>
                </div>

                {/* Row 2 & 3: Type Grid - Adjusted text contrast */}
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <button onClick={() => setNewTaskType('high')} className={`py-2 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${newTaskType === 'high' ? 'bg-white/[0.1] text-cyan-400 border border-white/[0.1]' : 'bg-white/[0.02] text-slate-300 hover:text-white'}`}>ASAP</button>
                    <button onClick={() => setNewTaskType('medium')} className={`py-2 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${newTaskType === 'medium' ? 'bg-white/[0.1] text-cyan-400 border border-white/[0.1]' : 'bg-white/[0.02] text-slate-300 hover:text-white'}`}>SOON</button>
                    <button onClick={() => setNewTaskType('low')} className={`py-2 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${newTaskType === 'low' ? 'bg-white/[0.1] text-cyan-400 border border-white/[0.1]' : 'bg-white/[0.02] text-slate-300 hover:text-white'}`}>LATER</button>
                    
                    <button onClick={() => setNewTaskType('leisure')} className={`py-2 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${newTaskType === 'leisure' ? 'bg-white/[0.1] text-cyan-400 border border-white/[0.1]' : 'bg-white/[0.02] text-slate-300 hover:text-white'}`}>LEISURE</button>
                    <button onClick={() => setNewTaskType('backlog')} className={`py-2 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${newTaskType === 'backlog' ? 'bg-white/[0.1] text-cyan-400 border border-white/[0.1]' : 'bg-white/[0.02] text-slate-300 hover:text-white'}`}>BACKLOG</button>
                    <button onClick={() => setNewTaskType('chores')} className={`py-2 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${newTaskType === 'chores' ? 'bg-white/[0.1] text-cyan-400 border border-white/[0.1]' : 'bg-white/[0.02] text-slate-300 hover:text-white'}`}>CHORES</button>
                </div>

                {/* Row 4: Big Add Button */}
                <button 
                    onClick={addTask}
                    className="w-full py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs font-bold text-slate-300 uppercase tracking-widest hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30 transition-all flex items-center justify-center gap-2 group shadow-lg"
                >
                    <Plus size={14} className="group-hover:scale-125 transition-transform duration-300" />
                    Add Task
                </button>
            </div>

            {/* Categories / Backlog List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 scrollbar-hide mask-image-b">
                {SIDEBAR_CATEGORIES.map(cat => {
                    const catTasks = tasks.filter(t => t.type === cat.id && t.status === 'unscheduled');
                    const isExpanded = expandedCategories[cat.id];
                    
                    if (catTasks.length === 0 && cat.id !== 'backlog') return null;

                    return (
                        <div key={cat.id} className="group">
                            <button 
                                onClick={() => toggleCategory(cat.id)}
                                className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-1"
                            >
                                <div className="flex items-center gap-1.5">
                                    <ChevronRight size={10} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                    <span>{cat.label}</span>
                                </div>
                                <span className="bg-white/[0.05] text-slate-400 px-1.5 py-0.5 rounded text-[9px] min-w-[18px] text-center">
                                    {catTasks.length}
                                </span>
                            </button>
                            
                            <div className={`space-y-1.5 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                {catTasks.map(task => (
                                    <TaskCard 
                                        key={task.id} 
                                        task={task} 
                                        variant="sidebar" // Always sidebar variant for backlog
                                        onDragStart={handleDragStart} 
                                        onToggleComplete={toggleTaskComplete}
                                    />
                                ))}
                                {catTasks.length === 0 && (
                                    <div className="text-[9px] text-slate-600 italic pl-5 py-1">No tasks</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* User / Settings Footer */}
            <div className="p-3 border-t border-white/[0.05] flex items-center justify-between bg-[#15192b]/50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-400 to-orange-400 border-2 border-white/10 shadow-lg"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white">Alex Doe</span>
                        <span className="text-[9px] text-slate-500">Pro Plan</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => setShowSettings(true)} className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors">
                        <Settings size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const renderGlassTopMenu = () => {
    const tabs = [
        { id: 'planner', label: 'Planner', icon: CalendarDays },
        { id: 'eisenhower', label: 'Matrix', icon: Target },
        { id: 'focus', label: 'Deep Work', icon: Flame },
        { id: 'pomodoro', label: 'Timer', icon: Timer },
        { id: 'habits', label: 'Habits', icon: ListChecks },
        { id: 'notes', label: 'Journal', icon: Notebook },
        { id: 'analytics', label: 'Stats', icon: BarChart3 },
    ];

    return (
        <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 pointer-events-none">
             {/* Navigation Tabs - Centered Float */}
             <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl bg-[#1e2338]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl mx-auto mt-3">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                                ${isActive 
                                    ? 'text-white shadow-lg bg-white/[0.08]' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                }
                            `}
                        >
                            <Icon size={14} className={isActive ? 'text-cyan-400' : ''} />
                            <span>{tab.label}</span>
                            {isActive && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none border border-white/[0.05]"></div>
                            )}
                        </button>
                    )
                })}
             </div>
        </div>
    );
  };

  const renderWeekStacked = () => (
        <div className="flex-grow flex relative mt-4 overflow-y-auto no-scrollbar gap-2">
            {currentWeekDays.map((day, i) => {
                    const dayTasks = tasks.filter(t => t.status !== 'unscheduled' && t.dueDate === formatDate(day));
                    const isDayEmpty = dayTasks.length === 0; // Determine if the day has no scheduled tasks
                    const isToday = formatDate(day) === todayStr;

                    return (
                        <div
                        key={i}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnGrid(e, day, null)} 
                        className={`
                            flex-1 w-0 flex flex-col p-1.5 border-r last:border-none rounded-xl gap-2
                            ${isToday 
                                ? 'bg-cyan-500/[0.02] border border-cyan-500/20' 
                                : 'border-white/[0.05]'
                            }
                        `}
                        >
                            {dayTasks
                            .sort((a, b) => {
                                    const rowOrder: Record<string, number> = { 'GOAL': 0, 'FOCUS': 1, 'WORK': 2, 'LEISURE': 3, 'CHORES': 4 };
                                    const aVal = rowOrder[a.assignedRow || ''] ?? 99;
                                    const bVal = rowOrder[b.assignedRow || ''] ?? 99;
                                    return aVal - bVal;
                            })
                            .map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    variant="board" // Always board variant for grid
                                    onDragStart={handleDragStart}
                                    onToggleComplete={toggleTaskComplete}
                                />
                            ))}
                        </div>
                    );
                })}
        </div>
  );

  const renderWeekMatrix = () => (
    <div className="flex-grow flex flex-col relative mt-2 overflow-y-auto no-scrollbar pr-1">
        <div className="absolute top-0 left-2 text-[8px] font-bold text-slate-600 tracking-widest uppercase transform -translate-y-full mb-1">Mode</div>
        {ROW_LABELS.map(row => {
            const rowConfig = ROW_CONFIG[row];
            const style = rowConfig; 
            return (
                <div key={row} className={`${style.flexClass} shrink-0 flex border-b border-white/[0.05] last:border-b-0 group/row hover:bg-white/[0.01] transition-colors`}>
                    {/* Enhanced Label Column - Reduced width */}
                    <div className="w-16 shrink-0 flex flex-col items-center justify-center relative py-2 border-r border-white/[0.05]">
                        <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${style.barColor} opacity-60 group-hover/row:opacity-100 transition-opacity`}></div>
                        <rowConfig.icon size={14} className={`mb-1 ${style.color}`} />
                        <div className={`text-[8px] font-bold tracking-widest uppercase ${style.color} mb-0.5 scale-90`}>{rowConfig.label}</div>
                    </div>
                    
                    {/* Columns */}
                    {currentWeekDays.map((day, i) => {
                        const dayTasks = tasks.filter(t => t.dueDate === formatDate(day) && t.status !== 'unscheduled');
                        const isDayEmpty = dayTasks.length === 0; // Determine if the day has no scheduled tasks
                        return (
                            <GridCell 
                                key={`${i}-${row}`} 
                                day={day} 
                                row={row} 
                                isToday={formatDate(day) === todayStr}
                                tasks={tasks}
                                onDrop={(e, d, r) => handleDropOnGrid(e, d, r)}
                                onDragStart={handleDragStart}
                                onToggleComplete={toggleTaskComplete}
                                isDayEmpty={isDayEmpty}
                            />
                        );
                    })}
                </div>
            );
        })}
    </div>
  );

  const renderGlassTopGrid = () => (
    <div className="flex flex-col h-full font-sans text-slate-300 overflow-hidden">
      {/* Header - Compact & Moved Up - pt-1 removed */}
      <div className="flex items-center justify-between px-6 pb-2 shrink-0 relative z-20">
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-display font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
               Overview
            </h1>
            <p className="text-[10px] text-slate-400 font-medium ml-0.5">
               {currentWeekDays[0].toLocaleDateString('en-US', { month: 'short' })} {currentWeekDays[0].getDate()} — {currentWeekDays[6].getDate()}, {currentWeekDays[0].getFullYear()}
            </p>
        </div>

        {/* Centered Stack Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
             <button
                onClick={() => setIsStacked(!isStacked)}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-lg backdrop-blur-md
                    ${isStacked
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        : 'bg-white/[0.05] border-white/[0.1] text-slate-400 hover:text-white hover:bg-white/[0.1]'
                    }
                `}
            >
                <Layers size={12} />
                <span className="text-[10px] font-bold tracking-widest uppercase">{isStacked ? 'Unstack' : 'Stack'}</span>
            </button>
        </div>

        {/* Date Navigation - Moved up */}
        <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/[0.05] shadow-inner backdrop-blur-md">
           <button onClick={() => handleWeekChange('prev')} className="px-3 py-1.5 hover:bg-white/[0.05] rounded-lg text-slate-400 hover:text-white transition-colors flex items-center justify-center">
             <ChevronLeft size={14} />
           </button>
           <div className="px-2 py-1 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Week</div>
           <button onClick={() => handleWeekChange('next')} className="px-3 py-1.5 hover:bg-white/[0.05] rounded-lg text-slate-400 hover:text-white transition-colors flex items-center justify-center">
             <ChevronRight size={14} />
           </button>
        </div>
      </div>

      {/* Grid Body */}
      <div className="flex-grow flex flex-col px-4 pb-4 overflow-hidden relative"> 
        {/* Days Header - Significantly Scaled Up */}
        <div className={`flex ${isStacked ? 'pl-0' : 'pl-16'} pb-2 shrink-0 transition-all duration-300 pt-1 gap-0`}>
           {currentWeekDays.map((day, i) => {
             const isToday = formatDate(day) === todayStr;
             const dayTasks = tasks.filter(t => t.dueDate === formatDate(day) && t.status !== 'unscheduled');
             const totalMinutes = dayTasks.reduce((acc, t) => acc + t.duration, 0);
             
             // Capacity Logic
             const targetMinutesPerDay = TARGET_HOURS_PER_DAY * 60; 
             const percentage = Math.min(100, (totalMinutes / targetMinutesPerDay) * 100);
             
             // Format planned hours/minutes
             const plannedHours = totalMinutes / 60;
             let plannedDurationText: string;
             if (totalMinutes === 0) {
                 plannedDurationText = '0h planned';
             } else if (plannedHours < 1) {
                 plannedDurationText = `${totalMinutes}m`;
             } else {
                 plannedDurationText = `${plannedHours.toFixed(1).replace(/\.0$/, '')}h`;
             }

             // Color Logic for text and bar fill - Simplified per spec for "Quiet Grid"
             const statTextColor = 'text-slate-500/80';
             const barFillColor = 'bg-cyan-500/80'; // Always category-neutral color
             const dayHeaderCaption = totalMinutes === 0 ? 'Free day' : '';

             return (
                <div key={i} className="flex-1 w-0 text-center relative group px-1">
                    <div className={`
                        flex flex-col items-center py-2 px-1 rounded-xl transition-all relative 
                        ${isToday 
                            ? 'bg-gradient-to-b from-[#1e293b] to-transparent border-t border-cyan-500/30 text-cyan-50 shadow-[0_-5px_20px_rgba(6,182,212,0.1)] z-10' 
                            : 'border-transparent'
                        }
                    `}>
                        {/* Enlarged Day Name - Adjusted contrast */}
                        <span className={`text-xs font-black uppercase tracking-widest opacity-80 mb-0 ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>{DAYS[i]}</span>
                        
                        {/* Massive Date Number - Scaled to 4xl */}
                        <span className={`text-4xl font-display font-black leading-none ${isToday ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-slate-400'}`}>{day.getDate()}</span>
                        
                        {/* Optional "Free day" caption */}
                        {dayHeaderCaption && (
                            <span className="text-[10px] text-slate-600/70">{dayHeaderCaption}</span>
                        )}

                        {/* Ultra-thin Capacity Bar + Capacity Text */}
                        <div className="w-full mt-2 flex flex-col items-center">
                            {/* Bar Track */}
                            <div className="w-full h-1 relative rounded-full bg-slate-800/30 overflow-hidden">
                                 {/* Bar Fill */}
                                 <div 
                                    className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out ${barFillColor} rounded-full`}
                                    style={{ width: `${percentage}%` }}
                                 ></div>
                            </div>
                            
                            {/* Text Overlay - Small, muted capacity text */}
                            <div className={`text-[10px] mt-1 font-medium ${statTextColor} transition-colors`}>
                                 {dayTasks.length} tasks · {plannedDurationText}
                            </div>
                        </div>
                    </div>
                </div>
             );
           })}
        </div>

        {/* Rows */}
        {isStacked ? renderWeekStacked() : renderWeekMatrix()}
      </div>
    </div>
  );


  // --- LAYOUT: GLASS ONLY (Simplified) ---
  
  const renderGlassLayout = () => {
    return (
      <div className="flex h-screen w-full bg-[#161b2e] text-slate-200 selection:bg-cyan-500/30 font-sans overflow-hidden">
        {renderGlassSidebar()}
        <div className="flex-1 flex flex-col relative min-w-0 z-10">
            {renderGlassTopMenu()}
            {/* Reduced Top Padding to 12 (3rem) to bring everything up */}
            <div className="flex-1 overflow-hidden relative pt-14">
                {activeTab === 'planner' && renderGlassTopGrid()}
                {activeTab === 'eisenhower' && renderEisenhower()}
                {activeTab === 'focus' && renderFocus()}
                {activeTab === 'pomodoro' && renderPomodoro()}
                {activeTab === 'habits' && renderHabits()}
                {activeTab === 'notes' && renderNotes()}
                {activeTab === 'analytics' && renderAnalytics()}
            </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  
  return (
      <>
        {renderGlassLayout()}
        {showSettings && <SettingsModal />}
      </>
  );
};

export default App;
