import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Task, TaskType } from '../../../types';
import { TYPE_COLORS } from '../../../constants';

interface AnalyticsDashboardProps {
    tasks: Task[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
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
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
