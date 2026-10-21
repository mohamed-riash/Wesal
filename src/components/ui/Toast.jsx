import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useUserPreferences } from '../../context/UserPreferencesContext';

export default function Toast() {
  const { toastMessage } = useUserPreferences();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-900/90 text-gold-400 border border-gold-400/30 backdrop-blur-md shadow-2xl text-sm font-semibold pointer-events-none"
        >
          <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
