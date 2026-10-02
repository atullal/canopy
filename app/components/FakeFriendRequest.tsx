"use client";

import React, { useState } from 'react';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/fake-friend-request.json';
import AdaptiveHesitationEngine from './AdaptiveHesitationEngine';
import SplitScreenComparative from './SplitScreenComparative';
import AssistantVoiceBar from './AssistantVoiceBar';
import { motion, AnimatePresence } from 'framer-motion';

export default function FakeFriendRequest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);
  
  // Voice State
  const [voiceText, setVoiceText] = useState("You have a new friend request. Take a look at the profile.");
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const currentRequest = scenarioData.requests[currentIndex];

  const handleAction = (actionId: 'accept' | 'decline') => {
    let fb;
    if (actionId === 'accept' && currentRequest.isFake) {
      posthog.capture('scam_clicked', { requestId: currentRequest.id, reason: 'accepted_fake_friend' });
      fb = currentRequest.type === 'stranger-scam' ? scenarioData.feedback.gentleFailureStranger : scenarioData.feedback.gentleFailureCloned;
      setFeedback({ title: fb.title, message: fb.message, type: 'failure' });
      setVoiceText(fb.message);
      setHighlightId(undefined);
    } else if (actionId === 'decline' && !currentRequest.isFake) {
      fb = scenarioData.feedback.gentleFailureDeclineReal;
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
    if (currentIndex + 1 < scenarioData.requests.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // restart
    }
    // Reset initial voice instruction for the new screen
    setVoiceText("You have another friend request. Take a close look.");
    setHighlightId(undefined);
  };

  const triggerHint = () => {
    setVoiceText("Check the Friends in Common and the Join Date. Real friends usually share connections.");
    setHighlightId("stats-box");
  };

  return (
    <AdaptiveHesitationEngine hintContent={null} idleTimeMs={10000} onIdle={triggerHint}>
      <div className="max-w-5xl mx-auto p-6 font-sans pb-40">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">{scenarioData.title}</h1>
        <div className="bg-green-100 border-4 border-green-500 p-6 rounded-2xl text-xl mb-8 text-green-900 leading-relaxed shadow-sm">
          {scenarioData.description}
        </div>

        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="border-4 border-gray-300 rounded-3xl bg-gray-50 overflow-hidden shadow-xl max-w-sm mx-auto"
        >
          <div className="bg-blue-600 p-6 text-white font-bold text-center text-2xl tracking-wide shadow-inner">
            New Friend Request
          </div>
          <div className="p-8 bg-white flex flex-col items-center">
            <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center text-gray-400 text-6xl overflow-hidden border-4 border-gray-100 shadow-sm">
              👤
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">{currentRequest.name}</h2>
            <p className="text-xl text-gray-600 mb-8 text-center italic leading-relaxed">"{currentRequest.bio}"</p>
            
            <div id="stats-box" className="w-full bg-gray-50 border-2 border-gray-200 p-6 rounded-xl mb-8 shadow-inner">
              <div className="flex justify-between mb-4 border-b-2 border-gray-200 pb-3">
                <span className="text-gray-600 font-bold text-xl">Friends in Common:</span>
                <span className="text-gray-900 font-black text-2xl">{currentRequest.friendsInCommon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold text-xl">Profile Created:</span>
                <span className="text-gray-900 font-black text-xl">{currentRequest.joinDate}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => handleAction('accept')}
                className="w-full bg-blue-600 text-white font-bold text-2xl py-4 px-6 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-md focus:ring-4 focus:ring-blue-300"
              >
                {scenarioData.actions.find((a: any) => a.id === 'accept')?.label}
              </button>
              <button
                onClick={() => handleAction('decline')}
                className="w-full bg-gray-200 text-gray-800 font-bold text-2xl py-4 px-6 rounded-2xl hover:bg-gray-300 active:scale-95 transition-all shadow-sm focus:ring-4 focus:ring-gray-400"
              >
                {scenarioData.actions.find((a: any) => a.id === 'decline')?.label}
              </button>
            </div>
          </div>
        </motion.div>

        {/* The V4 Voice-First Assistant Bar */}
        <AssistantVoiceBar 
          textToSpeak={voiceText} 
          targetHighlightId={highlightId}
        />

        {/* Feedback Modal (Still needed for the Split-Screen comparison learning moment, but simplified) */}
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
                className="relative bg-white border-4 border-gray-400 p-8 md:p-12 rounded-3xl max-w-4xl w-full text-center shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <h3 className={`text-4xl font-black mb-6 ${feedback.type === 'failure' ? 'text-red-700' : feedback.type === 'success' ? 'text-green-700' : 'text-blue-700'}`}>
                  {feedback.title}
                </h3>
                
                {/* The visual learning moment */}
                <div className="mb-10 text-left">
                  <SplitScreenComparative 
                    leftTitle="Red Flags (Scam)"
                    leftContent={
                      <ul className="list-disc pl-6 space-y-3 text-gray-800 text-xl font-medium">
                        <li><strong>Joined Today/Yesterday:</strong> Scammers make new accounts constantly.</li>
                        <li><strong>0 Friends in Common:</strong> Real friends are connected to your other friends.</li>
                        <li><strong>Urgent Bios:</strong> Excuses like "had to make a new account."</li>
                      </ul>
                    }
                    rightTitle="Green Flags (Safe)"
                    rightContent={
                      <ul className="list-disc pl-6 space-y-3 text-gray-800 text-xl font-medium">
                        <li><strong>Older Join Date:</strong> Indicates a long-standing, real account.</li>
                        <li><strong>Mutual Friends:</strong> Sharing several friends implies a real community connection.</li>
                        <li><strong>Normal Bio:</strong> Standard hobbies or work without asking for anything.</li>
                      </ul>
                    }
                  />
                </div>

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
