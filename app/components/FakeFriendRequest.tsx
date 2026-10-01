"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/fake-friend-request.json';
import AdaptiveHesitationEngine from './AdaptiveHesitationEngine';
import SplitScreenComparative from './SplitScreenComparative';

export default function FakeFriendRequest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);

  const currentRequest = scenarioData.requests[currentIndex];

  const handleAction = (actionId: 'accept' | 'decline') => {
    if (actionId === 'accept' && currentRequest.isFake) {
      posthog.capture('scam_clicked', { requestId: currentRequest.id, reason: 'accepted_fake_friend' });
      const fb = currentRequest.type === 'stranger-scam' ? scenarioData.feedback.gentleFailureStranger : scenarioData.feedback.gentleFailureCloned;
      setFeedback({
        title: fb.title,
        message: fb.message,
        type: 'failure'
      });
    } else if (actionId === 'decline' && !currentRequest.isFake) {
      setFeedback({
        title: scenarioData.feedback.gentleFailureDeclineReal.title,
        message: scenarioData.feedback.gentleFailureDeclineReal.message,
        type: 'info'
      });
    } else {
      setFeedback({
        title: scenarioData.feedback.success.title,
        message: scenarioData.feedback.success.message,
        type: 'success'
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex + 1 < scenarioData.requests.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // restart
    }
  };

  const hintContent = (
    <p className="text-2xl leading-relaxed text-gray-900">
      Look at <strong className="font-black">Friends in Common</strong> and the <strong className="font-black">Join Date</strong>. Real friends usually have mutual connections and older accounts.
    </p>
  );

  return (
    <AdaptiveHesitationEngine hintContent={hintContent} idleTimeMs={10000}>
      <main className="max-w-4xl mx-auto p-4 md:p-8 font-sans text-xl text-gray-900 bg-gray-50 min-h-screen">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black">
            {scenarioData.title}
          </h1>
          <div 
            role="region" 
            aria-label="Scenario Description"
            className="bg-white border-4 border-blue-200 p-6 rounded-2xl text-2xl leading-relaxed text-gray-900 shadow-sm inline-block text-left max-w-3xl"
          >
            {scenarioData.description}
          </div>
        </header>

        <div className="border-4 border-gray-300 rounded-[2.5rem] bg-gray-50 overflow-hidden shadow-xl max-w-md mx-auto flex flex-col min-h-[600px]">
          <div className="bg-blue-900 p-6 text-white font-black text-center text-2xl border-b-4 border-blue-950 shadow-sm z-10">
            New Friend Request
          </div>
          
          <div className="flex-1 overflow-hidden relative bg-white">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                className="p-8 flex flex-col items-center h-full"
              >
                <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center text-gray-700 text-6xl overflow-hidden border-8 border-gray-100 shadow-inner">
                  👤
                </div>
                <h2 className="text-3xl font-black text-black mb-3 text-center tracking-tight">{currentRequest.name}</h2>
                <p className="text-gray-800 mb-8 text-center italic text-2xl leading-relaxed">\"{currentRequest.bio}\"</p>
                
                <div className="w-full bg-blue-50 border-4 border-blue-200 p-6 rounded-2xl mb-8 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b-2 border-blue-200 pb-4">
                    <span className="text-blue-900 font-bold text-xl">Friends in Common:</span>
                    <span className="text-black font-black text-2xl">{currentRequest.friendsInCommon}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-900 font-bold text-xl">Profile Created:</span>
                    <span className="text-black font-black text-2xl">{currentRequest.joinDate}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction('accept')}
                    className="w-full bg-blue-800 text-white font-black py-6 px-4 rounded-2xl hover:bg-blue-900 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-800 min-h-[5rem] text-2xl shadow-md"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'accept')?.label || 'Accept'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction('decline')}
                    className="w-full bg-gray-200 text-gray-900 font-black py-6 px-4 rounded-2xl hover:bg-gray-300 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-600 min-h-[5rem] text-2xl shadow-sm border-2 border-gray-400"
                  >
                    {scenarioData.actions.find((a: any) => a.id === 'decline')?.label || 'Decline'}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Feedback Modal with Framer Motion */}
        <AnimatePresence>
          {feedback && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-gray-900/90 backdrop-blur-md"
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
                className="relative bg-white border-8 border-gray-300 p-8 md:p-12 rounded-[3rem] max-w-4xl w-full text-center shadow-2xl my-8 z-10"
              >
                <h3 className={`text-4xl md:text-5xl font-extrabold mb-8 ${feedback.type === 'failure' ? 'text-red-800' : feedback.type === 'success' ? 'text-green-800' : 'text-blue-800'}`}>
                  {feedback.title}
                </h3>
                <div className="text-2xl text-gray-900 whitespace-pre-wrap mb-10 text-left leading-relaxed bg-gray-100 p-8 rounded-2xl border-4 border-gray-200 shadow-inner">
                  {feedback.message}
                </div>

                {/* Show SplitScreenComparative in feedback for learning */}
                <div className="mb-10 text-left">
                  <SplitScreenComparative 
                    leftTitle="Red Flags (Scam)"
                    leftContent={
                      <ul className="list-disc pl-8 space-y-4 text-gray-900 text-xl font-medium">
                        <li><strong className="font-black text-red-900">Joined Today/Yesterday:</strong> Scammers make new accounts constantly.</li>
                        <li><strong className="font-black text-red-900">0 Friends in Common:</strong> If it's your real friend, they should be connected to others you know.</li>
                        <li><strong className="font-black text-red-900">Urgent/Weird Bios:</strong> \"Had to make a new account\" or asking for help.</li>
                      </ul>
                    }
                    rightTitle="Green Flags (Safe)"
                    rightContent={
                      <ul className="list-disc pl-8 space-y-4 text-gray-900 text-xl font-medium">
                        <li><strong className="font-black text-green-900">Older Join Date:</strong> E.g., \"Joined 2014\", meaning the account has history.</li>
                        <li><strong className="font-black text-green-900">Mutual Friends:</strong> Sharing several friends in common means they are likely part of your real-world community.</li>
                        <li><strong className="font-black text-green-900">Normal Bio:</strong> Mentions normal hobbies or work without asking for anything.</li>
                      </ul>
                    }
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  autoFocus
                  className="w-full bg-blue-800 text-white font-black py-6 px-10 rounded-2xl hover:bg-blue-900 transition-colors focus:outline-none focus-visible:ring-8 focus-visible:ring-blue-600 min-h-[5.5rem] text-3xl shadow-xl"
                >
                  Continue
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </AdaptiveHesitationEngine>
  );
}
