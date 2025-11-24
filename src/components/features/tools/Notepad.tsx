import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Note } from '../../../types';

interface NotepadProps {
    notes: Note[];
}

export const Notepad: React.FC<NotepadProps> = ({ notes }) => {
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
