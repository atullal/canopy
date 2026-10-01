"use client";

import React, { useState } from 'react';
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
    <p>Look at <strong>Friends in Common</strong> and the <strong>Join Date</strong>. Real friends usually have mutual connections and older accounts.</p>
  );

  return (
    <AdaptiveHesitationEngine hintContent={hintContent} idleTimeMs={10000}>
      <div className="max-w-5xl mx-auto p-6 font-sans">
        <h1 className="text-3xl font-bold mb-4">{scenarioData.title}</h1>
        <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-lg mb-6 text-green-900">
          {scenarioData.description}
        </div>

        <div className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden shadow-md max-w-sm mx-auto">
          <div className="bg-blue-600 p-4 text-white font-bold text-center text-lg">
            New Friend Request
          </div>
          <div className="p-6 bg-white flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-400 text-5xl overflow-hidden border-4 border-white shadow-sm">
              👤
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{currentRequest.name}</h2>
            <p className="text-gray-600 mb-6 text-center italic">"{currentRequest.bio}"</p>
            
            <div className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-3 border-b border-gray-200 pb-2">
                <span className="text-gray-600 font-semibold">Friends in Common:</span>
                <span className="text-gray-900 font-bold">{currentRequest.friendsInCommon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Profile Created:</span>
                <span className="text-gray-900 font-bold">{currentRequest.joinDate}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => handleAction('accept')}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition"
              >
                {scenarioData.actions.find((a: any) => a.id === 'accept')?.label}
              </button>
              <button
                onClick={() => handleAction('decline')}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-300 transition"
              >
                {scenarioData.actions.find((a: any) => a.id === 'decline')?.label}
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {feedback && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-6 md:p-8 rounded-2xl max-w-4xl w-full text-center shadow-xl my-8">
              <h3 className={`text-3xl font-bold mb-4 ${feedback.type === 'failure' ? 'text-red-600' : feedback.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
                {feedback.title}
              </h3>
              <div className="text-xl text-gray-700 whitespace-pre-wrap mb-8 text-left leading-relaxed">
                {feedback.message}
              </div>

              {/* Show SplitScreenComparative in feedback for learning */}
              <div className="mb-8 text-left">
                <SplitScreenComparative 
                  leftTitle="Red Flags (Scam)"
                  leftContent={
                    <ul className="list-disc pl-6 space-y-3 text-gray-700 text-lg">
                      <li><strong>Joined Today/Yesterday:</strong> Scammers make new accounts constantly.</li>
                      <li><strong>0 Friends in Common:</strong> If it's your real friend, they should be connected to others you know.</li>
                      <li><strong>Urgent/Weird Bios:</strong> "Had to make a new account" or asking for help.</li>
                    </ul>
                  }
                  rightTitle="Green Flags (Safe)"
                  rightContent={
                    <ul className="list-disc pl-6 space-y-3 text-gray-700 text-lg">
                      <li><strong>Older Join Date:</strong> E.g., "Joined 2014", meaning the account has history.</li>
                      <li><strong>Mutual Friends:</strong> Sharing several friends in common means they are likely part of your real-world community.</li>
                      <li><strong>Normal Bio:</strong> Mentions normal hobbies or work without asking for anything.</li>
                    </ul>
                  }
                />
              </div>

              <button 
                onClick={handleNext}
                className="bg-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-700 w-full transition text-xl"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </AdaptiveHesitationEngine>
  );
}
