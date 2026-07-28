"use client";

import React, { useState } from 'react';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/urgent-text-message.json';

export default function UrgentTextMessage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);

  const currentMessage = scenarioData.messages[currentIndex];

  const handleAction = (actionId: string) => {
    if (actionId === 'reply' && currentMessage.isScam) {
      // Failed: Replied to a scam
      posthog.capture('scam_clicked', { messageId: currentMessage.id, reason: 'replied_to_scam' });
      setFeedback({
        title: scenarioData.feedback.gentleFailureScamReply.title,
        message: scenarioData.feedback.gentleFailureScamReply.message,
        type: 'failure'
      });
    } else if (actionId === 'delete' && currentMessage.isScam) {
      // Success: Deleted a scam
      setFeedback({
        title: scenarioData.feedback.success.title,
        message: scenarioData.feedback.success.message,
        type: 'success'
      });
    } else if (actionId === 'reply' && !currentMessage.isScam) {
      // Success: Replied to a safe message
      setFeedback({
        title: "Great job!",
        message: "You correctly identified that this message was a normal, safe reminder. It is perfectly safe to reply to messages like this. Well done!",
        type: 'success'
      });
    } else if (actionId === 'delete' && !currentMessage.isScam) {
      // Safe choice but incorrect: Deleted a safe message
      setFeedback({
        title: scenarioData.feedback.gentleFailureSafeDelete.title,
        message: scenarioData.feedback.gentleFailureSafeDelete.message,
        type: 'info'
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex + 1 < scenarioData.messages.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Restart the sequence
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">{scenarioData.title}</h1>
      <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-lg mb-6 text-green-900">
        {scenarioData.description}
      </div>

      <div className="max-w-sm mx-auto border-4 border-gray-800 rounded-[2rem] bg-gray-50 overflow-hidden shadow-lg flex flex-col h-[600px] relative">
        {/* Phone Header */}
        <div className="bg-gray-200 p-4 text-center border-b border-gray-300 font-bold text-gray-800">
          {currentMessage.sender}
        </div>

        {/* Phone Screen (Messages Area) */}
        <div className="flex-1 p-4 flex flex-col justify-end bg-gray-100 pb-6">
          <div className="bg-blue-100 text-gray-900 p-4 rounded-2xl rounded-bl-sm text-lg shadow-sm w-5/6">
            {currentMessage.body}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-gray-300 flex gap-4">
          <button
            onClick={() => handleAction('reply')}
            className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            💬 Reply
          </button>
          <button
            onClick={() => handleAction('delete')}
            className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 transition"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Modal Feedback */}
      {feedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
            <h3 className={`text-2xl font-bold mb-4 ${feedback.type === 'failure' ? 'text-red-600' : feedback.type === 'success' ? 'text-green-600' : 'text-gray-800'}`}>
              {feedback.title}
            </h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap mb-6 text-left">
              {feedback.message}
            </div>
            <button 
              onClick={handleNext}
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
