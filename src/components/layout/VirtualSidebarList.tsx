import React, { useMemo, useCallback } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Task, TaskType, GridRow } from '../../types';
import { CATEGORIES } from '../../constants';
import { SidebarTaskCard } from '../tasks/SidebarTaskCard';
import { ChevronDown } from 'lucide-react';

interface VirtualSidebarListProps {
    tasks: Task[];
    expandedCategories: Record<string, boolean>;
    toggleCategory: (catId: string) => void;
    dragOverCategory: string | null;
    onCategoryDragEnter: (e: React.DragEvent, catId: string) => void;
    onCategoryDragLeave: (e: React.DragEvent, catId: string) => void;
    onCategoryDrop: (e: React.DragEvent, catId: string) => void;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
    onScheduleTask: (taskId: string, date: Date, row: GridRow | null, type?: TaskType) => void;
    isMobile: boolean;
    onCloseSidebar?: () => void;
    onLongPressTask?: (task: Task) => void;
}

type ListItem =
    | { type: 'header'; category: typeof CATEGORIES[0]; count: number; isExpanded: boolean }
    | { type: 'task'; task: Task };

export const VirtualSidebarList: React.FC<VirtualSidebarListProps> = ({
    tasks,
    expandedCategories,
    toggleCategory,
    dragOverCategory,
    onCategoryDragEnter,
    onCategoryDragLeave,
    onCategoryDrop,
    isDragging,
    onDragStart,
    onDragEnd,
    onUpdateTask,
    onDeleteTask,
    onToggleComplete,
    onScheduleTask,
    isMobile,
    onCloseSidebar,
    onLongPressTask
}) => {
    const listRef = React.useRef<List>(null);

    const flatList = useMemo(() => {
        const items: ListItem[] = [];

        CATEGORIES.forEach(cat => {
            const catTasks = tasks.filter(t => t.type === cat.id && t.status === 'unscheduled' && !t.isFrozen);
            const isExpanded = expandedCategories[cat.id];

            // 1. Header
            items.push({
                type: 'header',
                category: cat,
                count: catTasks.length,
                isExpanded
            });

            // 2. Body (only if expanded)
            if (isExpanded) {
                // Tasks only - no placeholder zones
                catTasks.forEach(task => {
                    items.push({ type: 'task', task });
                });
            }
        });

        return items;
    }, [tasks, expandedCategories]);

    React.useEffect(() => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, [flatList]);

    const getItemKey = useCallback((index: number) => {
        const item = flatList[index];
        switch (item.type) {
            case 'task':
                return `task-${item.task.id}`;
            case 'header':
                return `header-${item.category.id}`;

            default:
                return index;
        }
    }, [flatList]);

    const getItemSize = (index: number) => {
        const item = flatList[index];
        switch (item.type) {
            case 'header': return 48;
            case 'task': return 80;
            default: return 50;
        }
    };

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = flatList[index];

        // Adjust style for margins if needed, or handle inside the component
        // react-window uses absolute positioning, so margins don't collapse.
        // We can add padding to the inner div.

        switch (item.type) {
            case 'header':
                const { category, count, isExpanded } = item;
                return (
                    <div style={style} className="px-3">
                        <div
                            className={`border-t border-zinc-800/40 pt-3 pb-1 flex items-center justify-between group ${category.id === 'high' ? 'border-t-0 pt-0' : ''}`}
                            onDragEnter={(e) => onCategoryDragEnter(e, category.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragLeave={(e) => onCategoryDragLeave(e, category.id)}
                            onDrop={(e) => onCategoryDrop(e, category.id)}
                        >
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="flex-1 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full shadow-[0_0_6px_currentColor]" style={{ backgroundColor: category.color, color: category.color }} />
                                    <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                        {category.label}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 font-mono">
                                        {count}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className="transition-transform text-zinc-600 group-hover:text-zinc-400"
                                        style={{
                                            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                                        }}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                );

            case 'task':
                return (
                    <div style={style} className="px-3 pb-2">
                        <SidebarTaskCard
                            task={item.task}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                            onToggleComplete={onToggleComplete}
                            onScheduleTask={onScheduleTask}
                            isMobile={isMobile}
                            onCloseSidebar={onCloseSidebar}
                            onLongPress={onLongPressTask}
                        />
                    </div>
                );


        }
    };

    return (
        <div className="flex-1 min-h-0 h-full">
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        height={height}
                        width={width}
                        itemCount={flatList.length}
                        itemSize={getItemSize}
                        itemKey={getItemKey}
                        className="scrollbar-hide"
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </div>
    );
};
