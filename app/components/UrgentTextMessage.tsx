"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/urgent-text-message.json';

export default function UrgentTextMessage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentMessage = scenarioData.messages[currentIndex];

  const handleAction = (actionId: string) => {
    if (actionId === 'delete') {
      setIsDeleting(true);
      setTimeout(() => {
        setIsDeleting(false);
        processFeedback(actionId);
      }, 400); // Wait for delete animation to finish
    } else {
      processFeedback(actionId);
    }
  };

  const processFeedback = (actionId: string) => {
    if (actionId === 'reply' && currentMessage.isScam) {
      posthog.capture('scam_clicked', { messageId: currentMessage.id, reason: 'replied_to_scam' });
      setFeedback({
        title: scenarioData.feedback.gentleFailureScamReply.title,
        message: scenarioData.feedback.gentleFailureScamReply.message,
        type: 'failure'
      });
    } else if (actionId === 'delete' && currentMessage.isScam) {
      setFeedback({
        title: scenarioData.feedback.success.title,
        message: scenarioData.feedback.success.message,
        type: 'success'
      });
    } else if (actionId === 'reply' && !currentMessage.isScam) {
      setFeedback({
        title: "Great job!",
        message: "You correctly identified that this message was a normal, safe reminder. It is perfectly safe to reply to messages like this. Well done!",
        type: 'success'
      });
    } else if (actionId === 'delete' && !currentMessage.isScam) {
      setFeedback({
        title: scenarioData.feedback.gentleFailureSafeDelete.title,
        message: scenarioData.feedback.gentleFailureSafeDelete.message,
        type: 'info'
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setIsDeleting(false);
    if (currentIndex + 1 < scenarioData.messages.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Restart the sequence
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
          className="bg-white border-4 border-blue-100 p-6 rounded-2xl text-2xl leading-relaxed text-gray-800 shadow-sm inline-block text-left"
        >
          {scenarioData.description}
        </div>
      </header>

      <div className="max-w-md mx-auto border-8 border-gray-900 rounded-[3rem] bg-white overflow-hidden shadow-2xl flex flex-col h-[700px] relative">
        {/* Phone Header */}
        <div className="bg-gray-100 p-6 text-center border-b-2 border-gray-300">
          <div className="text-2xl font-black text-gray-900 tracking-wide">
            {currentMessage.sender}
          </div>
          <div className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">
            Text Message
          </div>
        </div>

        {/* Phone Screen (Messages Area) */}
        <div className="flex-1 p-6 flex flex-col justify-end bg-white pb-8 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!isDeleting && (
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, y: 50, transformOrigin: 'bottom left' }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="w-full flex justify-start"
              >
                <div className="bg-gray-200 text-black p-6 rounded-3xl rounded-bl-sm shadow-md max-w-[90%] border-2 border-gray-300">
                  <p className="text-2xl font-medium leading-snug">
                    {currentMessage.body}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction('reply')}
            className="flex-1 bg-blue-100 text-blue-900 border-2 border-blue-600 font-bold text-2xl py-6 px-4 rounded-2xl hover:bg-blue-200 active:bg-blue-300 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 min-h-[5rem] shadow-sm flex items-center justify-center gap-2"
          >
            💬 <span className="mt-1">Reply</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction('delete')}
            className="flex-1 bg-red-100 text-red-900 border-2 border-red-600 font-bold text-2xl py-6 px-4 rounded-2xl hover:bg-red-200 active:bg-red-300 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 min-h-[5rem] shadow-sm flex items-center justify-center gap-2"
          >
            🗑️ <span className="mt-1">Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Modal Feedback with Framer Motion */}
      <AnimatePresence>
        {feedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={handleNext}
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
                onClick={handleNext}
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
