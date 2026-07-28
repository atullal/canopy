"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/update-screen.json';

export default function UpdateScreen() {
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

  const handleAction = (actionId: 'install' | 'ignore') => {
    if (!currentChallenge.isReal) {
      // Fake Pop-up Challenge
      if (actionId === 'install') {
        posthog.capture('scam_clicked', { challengeId: currentChallenge.id, reason: 'installed_fake_update' });
        setFeedback({
          title: scenarioData.feedback.gentleFailureFakeInstall.title,
          message: scenarioData.feedback.gentleFailureFakeInstall.message,
          type: 'failure'
        });
      } else {
        // Correct Action
        setFeedback({
          title: "Great job!",
          message: "You saw right through the scary fake pop-up and closed it. Let's move on to the next challenge!",
          type: 'success'
        });
      }
    } else {
      // Real Update Challenge
      if (actionId === 'ignore') {
        setFeedback({
          title: scenarioData.feedback.gentleFailureRealIgnore.title,
          message: scenarioData.feedback.gentleFailureRealIgnore.message,
          type: 'info'
        });
      } else {
        // Correct Action: Install Real Update
        setFeedback({
          title: scenarioData.feedback.success.title,
          message: scenarioData.feedback.success.message,
          type: 'success'
        });
      }
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

      <AnimatePresence mode="wait">
        <motion.div
          key={challengeIndex}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="w-full max-w-lg mx-auto"
        >
          {currentChallenge.type === 'browser-popup' ? (
            /* AGGRESSIVE, UGLY FAKE BROWSER POPUP */
            <div className="border-8 border-red-600 rounded-2xl bg-yellow-300 overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.5)]">
              <div className="bg-red-700 p-4 border-b-4 border-red-900 flex items-center">
                <div className="font-mono text-xl md:text-2xl font-black text-white tracking-widest break-all bg-red-900 px-4 py-3 rounded-lg border-2 border-red-400 w-full text-center shadow-inner">
                  {currentChallenge.urlBar}
                </div>
              </div>
              
              <div className="p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }} 
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="mb-6"
                >
                  <h3 className="text-red-700 text-5xl font-black uppercase drop-shadow-md tracking-tighter">
                    ⚠️ WARNING!
                  </h3>
                </motion.div>
                
                <p className="text-red-900 font-extrabold text-3xl leading-tight mb-10">
                  {currentChallenge.message}
                </p>
                
                <div className="flex flex-col w-full gap-5 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction('install')}
                    className="w-full bg-green-500 text-white border-4 border-green-700 font-black text-3xl py-6 rounded-2xl animate-pulse shadow-[0_10px_0_rgb(21,128,61)] hover:bg-green-400 active:shadow-[0_2px_0_rgb(21,128,61)] active:translate-y-2 focus:outline-none focus-visible:ring-8 focus-visible:ring-green-800 transition-all"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'install')?.label || 'INSTALL NOW'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction('ignore')}
                    className="w-full bg-transparent text-red-900 underline font-bold text-xl py-4 rounded-xl hover:bg-red-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-900"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'ignore')?.label || 'Close'}
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            /* CALM, OFFICIAL SYSTEM SETTINGS */
            <div className="border border-gray-300 rounded-[2.5rem] bg-white overflow-hidden shadow-lg">
              <div className="bg-gray-50/80 backdrop-blur-md p-6 border-b border-gray-200 text-center">
                <h2 className="font-semibold text-gray-800 text-2xl tracking-tight">⚙️ System Settings</h2>
              </div>
              
              <div className="p-10 flex flex-col items-center text-center min-h-[400px]">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8 shadow-inner border border-gray-200">
                   <span className="text-5xl">💻</span>
                </div>
                
                <h3 className="text-gray-900 text-3xl font-bold mb-4 tracking-tight">Software Update</h3>
                <p className="text-gray-600 text-xl leading-relaxed mb-12 max-w-sm">
                  {currentChallenge.message}
                </p>
                
                <div className="flex flex-col w-full gap-4 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction('install')}
                    className="w-full bg-blue-600 text-white font-semibold text-2xl py-5 rounded-2xl hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'install')?.label || 'Install Update'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction('ignore')}
                    className="w-full bg-gray-100 text-gray-700 font-semibold text-xl py-5 rounded-2xl hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'ignore')?.label || 'Later'}
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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
              onClick={handleNextChallenge}
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
                onClick={handleNextChallenge}
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
