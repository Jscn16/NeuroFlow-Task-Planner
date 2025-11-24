import React from 'react';
import { X, Cog, ArrowRight } from 'lucide-react';

interface SettingsModalProps {
    onClose: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onExport, onImport }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-3xl border border-white/[0.1] rounded-[2rem] p-8 w-96 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
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
                                onClick={onExport}
                                className="w-full text-left px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:border-cyan-500/30 transition-all"
                            >
                                Export Data (.json)
                            </button>
                            <label className="w-full text-left px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between group">
                                <span>Import Data (.json)</span>
                                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                                <input type="file" accept=".json" onChange={onImport} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
