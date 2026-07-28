"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/app-permissions.json';

export default function AppPermissions() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);

  const currentChallenge = scenarioData.challenges[challengeIndex];

  const handleNextChallenge = () => {
    setFeedback(null);
    if (challengeIndex + 1 < scenarioData.challenges.length) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      setChallengeIndex(0); // Restart
    }
  };

  const handleAction = (actionId: 'allow' | 'deny') => {
    if (!currentChallenge.isNecessary) {
      // Unnecessary permission (Contacts, Mic)
      if (actionId === 'allow') {
        posthog.capture('permission_evaluation_failed', { challengeId: currentChallenge.id, reason: 'allowed_unnecessary_permission' });
        setFeedback({
          title: scenarioData.feedback.gentleFailureUnnecessaryAllow.title,
          message: scenarioData.feedback.gentleFailureUnnecessaryAllow.message,
          type: 'failure'
        });
      } else {
        // Correct Action (Deny)
        setFeedback({
          title: "Great job!",
          message: "You correctly denied that permission. A flashlight app has no business accessing that information. Let's move on.",
          type: 'success'
        });
      }
    } else {
      // Necessary permission (Camera)
      if (actionId === 'deny') {
        posthog.capture('permission_evaluation_failed', { challengeId: currentChallenge.id, reason: 'denied_necessary_permission' });
        setFeedback({
          title: scenarioData.feedback.gentleFailureNecessaryDeny.title,
          message: scenarioData.feedback.gentleFailureNecessaryDeny.message,
          type: 'info' // The spec frame feels more informative here
        });
      } else {
        // Correct Action (Allow Camera)
        setFeedback({
          title: scenarioData.feedback.success.title,
          message: scenarioData.feedback.success.message,
          type: 'success'
        });
      }
    }
  };

  const handleModalClose = () => {
    if (feedback?.title === scenarioData.feedback.gentleFailureNecessaryDeny.title) {
      setFeedback(null); // Stay on challenge to try again
    } else {
      handleNextChallenge();
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

      <div className="max-w-[420px] mx-auto border-[16px] border-black rounded-[3.5rem] bg-gray-900 overflow-hidden shadow-2xl h-[750px] flex flex-col relative">
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-950 flex flex-col items-center justify-center text-white relative">
          
          {/* Background App Interface */}
          <div className="text-[8rem] mb-6 drop-shadow-xl select-none">{scenarioData.appContext.icon}</div>
          <div className="text-3xl font-extrabold tracking-wide mb-2 select-none">{scenarioData.appContext.appName}</div>
          
          {/* OS-Level Backdrop Blur & Pop-up */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={challengeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[6px] flex items-center justify-center p-6 z-10"
              aria-hidden={feedback !== null}
            >
              <motion.div 
                role="alertdialog"
                aria-modal="true"
                initial={{ scale: 0.8, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-full max-w-[320px] bg-white/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/20"
              >
                {/* OS Dialog Content */}
                <div className="p-6 text-center text-gray-900">
                  <h3 className="font-semibold text-[22px] leading-tight mb-2 tracking-tight">
                    {currentChallenge.requestText.split('.')[0]}.
                  </h3>
                  <p className="text-[17px] leading-snug font-medium text-gray-700">
                    {currentChallenge.requestText.split('.').slice(1).join('.').trim() || currentChallenge.requestText}
                  </p>
                </div>
                
                {/* OS Dialog Buttons - Stacked for extreme tappability */}
                <div className="flex flex-col border-t border-gray-300/50">
                  <motion.button
                    whileTap={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    onClick={() => handleAction('deny')}
                    className="w-full py-4 text-blue-600 font-normal text-2xl border-b border-gray-300/50 transition-colors focus:outline-none focus-visible:bg-gray-200"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'deny')?.label || "Don't Allow"}
                  </motion.button>
                  <motion.button
                    whileTap={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    onClick={() => handleAction('allow')}
                    className="w-full py-4 text-blue-600 font-semibold text-2xl transition-colors focus:outline-none focus-visible:bg-gray-200"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'allow')?.label || "Allow"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Feedback Modal with Framer Motion */}
      <AnimatePresence>
        {feedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={handleModalClose}
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
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleModalClose}
                autoFocus
                className="w-full sm:w-auto min-w-[14rem] bg-blue-700 text-white font-bold text-3xl py-6 px-10 rounded-xl hover:bg-blue-800 active:bg-blue-900 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 shadow-md"
              >
                Continue
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
