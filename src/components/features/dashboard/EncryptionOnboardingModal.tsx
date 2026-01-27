import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, X, Check, ArrowRight } from 'lucide-react';
import { WeekFluxLogo } from '../../brand/WeekFluxLogo';

interface EncryptionOnboardingModalProps {
    isOpen: boolean;
    onEnable: () => void;
    onSkip: () => void;
}

export const EncryptionOnboardingModal: React.FC<EncryptionOnboardingModalProps> = ({ isOpen, onEnable, onSkip }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative"
            >
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

                <div className="p-8 pt-10 text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30"
                    >
                        <ShieldCheck size={32} className="text-emerald-400" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-white mb-2">Secure your Workspace</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                        We highly recommend enabling End-to-End Encryption for your data privacy.
                    </p>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8 text-left space-y-4">
                        <div className="flex gap-3">
                            <div className="p-1.5 bg-emerald-500/20 rounded-lg h-fit text-emerald-400">
                                <Lock size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">Industry Standard Encryption</h3>
                                <p className="text-slate-400 text-xs mt-1">
                                    We use <span className="text-emerald-300 font-mono">AES-256-GCM</span>, the same standard used by banks and government agencies.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-1.5 bg-emerald-500/20 rounded-lg h-fit text-emerald-400">
                                <Check size={16} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">Zero Knowledge</h3>
                                <p className="text-slate-400 text-xs mt-1">
                                    Your data is encrypted <strong>before</strong> it leaves your device. We can never see your tasks or notes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onEnable}
                            className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 group"
                        >
                            Create Passphrase & Enable
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={onSkip}
                            className="w-full py-3 rounded-xl bg-transparent text-slate-500 font-medium text-sm hover:text-slate-300 hover:bg-white/5 transition-all"
                        >
                            Skip for now (Not Recommended)
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
