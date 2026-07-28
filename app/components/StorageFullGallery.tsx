"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/storage-full-gallery.json';

export default function StorageFullGallery() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      setFeedback({
        title: "No photos selected",
        message: "Please tap on some photos to select them before clicking Delete.",
        type: 'info'
      });
      return;
    }

    setIsDeleting(true);

    setTimeout(() => {
      const newlyDeleted = [...deletedIds, ...selectedIds];
      setDeletedIds(newlyDeleted);
      setSelectedIds([]);
      setIsDeleting(false);

      const deletedPhotos = scenarioData.photos.filter(p => newlyDeleted.includes(p.id));
      const deletedKeepers = deletedPhotos.filter(p => p.isKeeper);
      const deletedJunk = deletedPhotos.filter(p => !p.isKeeper);

      if (deletedKeepers.length > 0) {
        posthog.capture('keeper_deleted', { reason: 'deleted_keeper_photo' });
        setFeedback({
          title: scenarioData.feedback.gentleFailureKeeperDeleted.title,
          message: scenarioData.feedback.gentleFailureKeeperDeleted.message,
          type: 'failure'
        });
      } else if (deletedJunk.length < 3) {
        setFeedback({
          title: scenarioData.feedback.gentleFailureNotEnoughDeleted.title,
          message: scenarioData.feedback.gentleFailureNotEnoughDeleted.message,
          type: 'info'
        });
      } else {
        setFeedback({
          title: scenarioData.feedback.success.title,
          message: scenarioData.feedback.success.message,
          type: 'success'
        });
      }
    }, 600); // Wait for the deletion animation to complete
  };

  const handleUndo = () => {
    if (deletedIds.length === 0) return;
    setDeletedIds([]);
    setFeedback({
      title: "Photos Restored",
      message: "Your deleted photos have been brought back from the 'Recently Deleted' folder. You can try selecting the junk photos again!",
      type: 'info'
    });
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'family': return 'bg-pink-100 text-pink-900 border-pink-200';
      case 'blurry': return 'bg-gray-300 blur-[2px] text-gray-800 border-gray-400';
      case 'accidental': return 'bg-gray-800 text-white border-gray-900';
      case 'pet': return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'duplicate': return 'bg-green-100 text-green-900 border-green-200';
      case 'best-shot': return 'bg-emerald-200 text-emerald-900 font-bold border-emerald-300';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 font-sans text-gray-900 bg-gray-50 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black">
          {scenarioData.title}
        </h1>
        <div 
          role="region" 
          aria-label="Scenario Description"
          className="bg-white border-4 border-blue-100 p-6 rounded-2xl text-2xl leading-relaxed text-gray-800 shadow-sm inline-block text-left max-w-3xl"
        >
          {scenarioData.description}
        </div>
      </header>

      <div className="bg-white p-6 md:p-10 border-4 border-gray-300 rounded-3xl shadow-xl flex flex-col min-h-[600px] relative">
        <h2 className="text-3xl font-black mb-8 text-black border-b-2 border-gray-200 pb-4">
          Camera Roll
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 flex-1">
          <AnimatePresence>
            {scenarioData.photos.map((photo) => {
              if (deletedIds.includes(photo.id)) return null;
              
              const isSelected = selectedIds.includes(photo.id);
              const isBeingDeleted = isDeleting && isSelected;
              
              return (
                <motion.button 
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isBeingDeleted ? 0 : 1, 
                    y: isBeingDeleted ? 150 : 0, 
                    rotate: isBeingDeleted ? (Math.random() * 20 - 10) : 0 
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: isBeingDeleted ? 100 : 300, 
                    damping: isBeingDeleted ? 20 : 25 
                  }}
                  whileHover={{ scale: isSelected ? 1 : 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSelect(photo.id)}
                  aria-pressed={isSelected}
                  className={`relative aspect-square flex items-center justify-center p-6 text-center rounded-2xl border-4 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-offset-4 overflow-hidden
                    ${getBgColor(photo.type)} 
                    ${isSelected ? 'ring-8 ring-blue-600 ring-offset-4 border-transparent z-10' : ''}
                  `}
                >
                  <span className={`text-xl md:text-2xl font-medium leading-snug z-0 ${isSelected ? 'opacity-50' : 'opacity-100'}`}>
                    {photo.description}
                  </span>
                  
                  {/* Massive Selection Checkmark */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-center justify-center z-10"
                      >
                        <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold shadow-2xl border-4 border-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 border-t-4 border-gray-100 pt-8 mt-auto relative z-20">
          <motion.button
            whileHover={{ scale: selectedIds.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: selectedIds.length > 0 ? 0.95 : 1 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex-1 font-bold text-2xl py-6 px-4 rounded-2xl transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 min-h-[5rem] shadow-sm flex items-center justify-center gap-3
              ${selectedIds.length > 0 
                ? 'bg-red-100 text-red-900 border-2 border-red-600 hover:bg-red-200 active:bg-red-300' 
                : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'}`}
          >
            🗑️ <span>{scenarioData.actions.find(a => a.id === 'delete')?.label} {selectedIds.length > 0 && `(${selectedIds.length})`}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: deletedIds.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: deletedIds.length > 0 ? 0.95 : 1 }}
            onClick={handleUndo}
            disabled={deletedIds.length === 0 || isDeleting}
            className={`flex-1 font-bold text-2xl py-6 px-4 rounded-2xl transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 min-h-[5rem] shadow-sm flex items-center justify-center gap-3
              ${deletedIds.length > 0 
                ? 'bg-blue-100 text-blue-900 border-2 border-blue-600 hover:bg-blue-200 active:bg-blue-300' 
                : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'}`}
          >
            ↩️ <span>{scenarioData.actions.find(a => a.id === 'undo')?.label}</span>
          </motion.button>
        </div>
      </div>

      {/* Modal Feedback with Framer Motion */}
      <AnimatePresence>
        {feedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={() => setFeedback(null)}
              aria-hidden="true"
            />
            
            <motion.div 
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 1 }}
              className="relative bg-white border-4 border-gray-200 p-8 md:p-12 rounded-3xl max-w-2xl w-full text-center shadow-2xl"
            >
              <h3 className={`text-4xl font-extrabold mb-8 ${feedback.type === 'failure' ? 'text-red-800' : feedback.type === 'success' ? 'text-green-800' : 'text-blue-800'}`}>
                {feedback.title}
              </h3>
              <div className="text-2xl text-gray-900 leading-relaxed whitespace-pre-wrap mb-10 text-left bg-gray-50 p-6 rounded-xl border border-gray-200">
                {feedback.message}
              </div>
              <button 
                onClick={() => setFeedback(null)}
                autoFocus
                className="w-full sm:w-auto min-w-[14rem] bg-blue-700 text-white font-bold text-3xl py-6 px-10 rounded-xl hover:bg-blue-800 active:bg-blue-900 active:scale-95 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 shadow-md"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
