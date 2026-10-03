"use client";

import React, { useState } from 'react';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/v4-inoculation-phantom-debt.json';
import AdaptiveHesitationEngine from './AdaptiveHesitationEngine';
import AssistantVoiceBar from './AssistantVoiceBar';
import { motion, AnimatePresence } from 'framer-motion';

export default function V4PhantomDebt() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);
  
  const currentChallenge = scenarioData.challenges[currentIndex];

  const [voiceText, setVoiceText] = useState("Read the message below carefully.");
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleAction = (actionId: 'manipulation' | 'safe') => {
    let fb;
    if (actionId === 'safe' && currentChallenge.isManipulation) {
      posthog.capture('scam_clicked', { challengeId: currentChallenge.id, reason: 'trusted_fake_bill' });
      fb = scenarioData.feedback.gentleFailureMissedManipulation;
      setFeedback({ title: fb.title, message: fb.message, type: 'failure' });
      setVoiceText(fb.message);
      setHighlightId(undefined);
    } else if (actionId === 'manipulation' && !currentChallenge.isManipulation) {
      fb = scenarioData.feedback.gentleFailureFlaggedSafe;
      setFeedback({ title: fb.title, message: fb.message, type: 'info' });
      setVoiceText(fb.message);
      setHighlightId(undefined);
    } else {
      fb = scenarioData.feedback.success;
      setFeedback({ title: fb.title, message: fb.message, type: 'success' });
      setVoiceText(fb.message);
      setHighlightId(undefined);
    }
    setShowFeedbackModal(true);
  };

  const handleNext = () => {
    setShowFeedbackModal(false);
    setFeedback(null);
    if (currentIndex + 1 < scenarioData.challenges.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // restart
    }
    setVoiceText("Read the next message carefully.");
    setHighlightId(undefined);
  };

  const triggerHint = () => {
    setVoiceText(currentChallenge.justInTimeHint);
    setHighlightId("email-body");
  };

  return (
    <AdaptiveHesitationEngine hintContent={null} idleTimeMs={10000} onIdle={triggerHint}>
      <div className="max-w-5xl mx-auto p-6 font-sans pb-40">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">{scenarioData.title}</h1>
        <div className="bg-blue-100 border-4 border-blue-500 p-6 rounded-2xl text-xl mb-8 text-blue-900 leading-relaxed shadow-sm">
          {scenarioData.description}
        </div>

        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="border-4 border-gray-300 rounded-3xl bg-gray-50 overflow-hidden shadow-xl max-w-2xl mx-auto"
        >
          <div className="bg-gray-800 p-4 text-white font-bold text-xl flex items-center shadow-inner">
            <span className="mr-3 text-3xl">✉️</span> Inbox
          </div>
          <div className="p-8 bg-white flex flex-col">
            <div className="border-b-2 border-gray-200 pb-4 mb-6">
              <p className="text-2xl text-gray-800 font-bold mb-2">
                From: <span className="text-gray-900">{currentChallenge.sender}</span>
              </p>
            </div>
            
            <div id="email-body" className="text-2xl text-gray-700 leading-relaxed mb-10 bg-gray-50 p-6 rounded-xl border-2 border-gray-100">
              {currentChallenge.body}
            </div>

            <div className="flex flex-col gap-4 w-full md:flex-row">
              <button
                onClick={() => handleAction('manipulation')}
                className="flex-1 bg-red-100 text-red-800 border-4 border-red-300 font-bold text-2xl py-4 px-6 rounded-2xl hover:bg-red-200 hover:border-red-400 active:scale-95 transition-all shadow-md focus:ring-4 focus:ring-red-300"
              >
                {scenarioData.actions.find((a: { id: string; label: string; type: string }) => a.id === 'manipulation')?.label}
              </button>
              <button
                onClick={() => handleAction('safe')}
                className="flex-1 bg-green-600 text-white font-bold text-2xl py-4 px-6 rounded-2xl hover:bg-green-700 active:scale-95 transition-all shadow-md focus:ring-4 focus:ring-green-400"
              >
                {scenarioData.actions.find((a: { id: string; label: string; type: string }) => a.id === 'safe')?.label}
              </button>
            </div>
          </div>
        </motion.div>

        {/* The V4 Voice-First Assistant Bar */}
        <AssistantVoiceBar 
          textToSpeak={voiceText} 
          targetHighlightId={highlightId}
        />

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedbackModal && feedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
                onClick={handleNext}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white border-4 border-gray-400 p-8 md:p-12 rounded-3xl max-w-3xl w-full text-center shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <h3 className={`text-4xl font-black mb-6 ${feedback.type === 'failure' ? 'text-red-700' : feedback.type === 'success' ? 'text-green-700' : 'text-blue-700'}`}>
                  {feedback.title}
                </h3>
                
                <p className="text-2xl text-gray-800 leading-relaxed mb-10">
                  {feedback.message}
                </p>

                <button 
                  onClick={handleNext}
                  className="bg-blue-900 text-white font-bold text-3xl py-5 px-12 rounded-2xl hover:bg-blue-950 active:scale-95 transition-all shadow-lg w-full sm:w-auto"
                >
                  Continue
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdaptiveHesitationEngine>
  );
}