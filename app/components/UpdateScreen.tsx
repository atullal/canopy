"use client";

import React, { useState } from 'react';
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
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">{scenarioData.title}</h1>
      <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-lg mb-6 text-green-900">
        {scenarioData.description}
      </div>

      <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden shadow-sm max-w-md mx-auto">
        {/* Render Browser Bar frame if it's a browser-popup */}
        {currentChallenge.type === 'browser-popup' ? (
          <div className="bg-gray-200 p-3 border-b border-gray-300 flex items-center">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            </div>
            <div className="bg-white px-4 py-1 rounded-full flex-1 font-mono text-sm text-gray-800 border border-gray-300">
              {currentChallenge.urlBar}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 border-b border-gray-300 text-center font-bold text-gray-800 text-lg">
            ⚙️ Settings App
          </div>
        )}

        {/* Challenge Content Area */}
        <div className="p-8 bg-white min-h-[250px] flex items-center justify-center">
          {currentChallenge.type === 'browser-popup' ? (
            <div className="bg-red-100 border-4 border-red-500 p-6 rounded-lg text-center animate-pulse">
              <h3 className="text-red-600 text-2xl font-black mb-3">⚠️ WARNING!</h3>
              <p className="text-red-900 font-bold text-lg leading-snug">
                {currentChallenge.message}
              </p>
            </div>
          ) : (
            <div className="text-left w-full">
              <h3 className="text-gray-900 text-2xl font-bold mb-3">Software Update</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {currentChallenge.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-100 border-t border-gray-300 flex gap-4">
          <button
            onClick={() => handleAction('install')}
            className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            {scenarioData.actions.find(a => a.id === 'install')?.label}
          </button>
          <button
            onClick={() => handleAction('ignore')}
            className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 transition"
          >
            {scenarioData.actions.find(a => a.id === 'ignore')?.label}
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full text-center shadow-xl">
            <h3 className={`text-2xl font-bold mb-4 ${feedback.type === 'failure' ? 'text-red-600' : 'text-green-600'}`}>
              {feedback.title}
            </h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap mb-6 text-left leading-relaxed">
              {feedback.message}
            </div>
            <button 
              onClick={handleNextChallenge}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 w-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
