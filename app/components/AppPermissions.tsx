"use client";

import React, { useState } from 'react';
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
        // We will keep them on the same challenge to try again, as implied by "Let's try again!"
        // So we won't increment index in handleNextChallenge for this specific case... wait, let's just let handleNextChallenge advance and loop around, or we can add a state to retry.
        // For simplicity, let's just let the normal flow happen, or reset.
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
    // If we just got the gentleFailureNecessaryDeny, we should probably stay on the same challenge to "try again"
    if (feedback?.title === scenarioData.feedback.gentleFailureNecessaryDeny.title) {
      setFeedback(null);
    } else {
      handleNextChallenge();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">{scenarioData.title}</h1>
      <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-lg mb-6 text-green-900">
        {scenarioData.description}
      </div>

      <div className="border-[12px] border-gray-900 rounded-[2.5rem] bg-gray-900 overflow-hidden shadow-2xl max-w-sm mx-auto h-[600px] flex flex-col relative">
        <div className="flex-1 bg-gray-800 flex flex-col items-center justify-center text-white relative">
          
          <div className="text-[6rem] mb-4">{scenarioData.appContext.icon}</div>
          <div className="text-2xl font-bold">{scenarioData.appContext.appName}</div>
          
          {/* Simulated System Permission Pop-up */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 bg-gray-100 text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 text-center font-semibold text-lg leading-snug">
              {currentChallenge.requestText}
            </div>
            <div className="flex border-t border-gray-300">
              <button
                onClick={() => handleAction('deny')}
                className="flex-1 py-4 text-red-600 font-semibold border-r border-gray-300 hover:bg-gray-200 transition"
              >
                {scenarioData.actions.find(a => a.id === 'deny')?.label}
              </button>
              <button
                onClick={() => handleAction('allow')}
                className="flex-1 py-4 text-blue-600 font-semibold hover:bg-gray-200 transition"
              >
                {scenarioData.actions.find(a => a.id === 'allow')?.label}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full text-center shadow-xl">
            <h3 className={`text-2xl font-bold mb-4 ${feedback.type === 'failure' ? 'text-red-600' : feedback.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
              {feedback.title}
            </h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap mb-6 text-left leading-relaxed">
              {feedback.message}
            </div>
            <button 
              onClick={handleModalClose}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 w-full transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
