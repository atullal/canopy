"use client";

import React, { useState } from 'react';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/phishing-inbox.json';

type Email = {
  id: string;
  isScam: boolean;
  senderName: string;
  senderAddress: string;
  subject: string;
  body: string;
  linkText: string | null;
  flags: string[];
};

export default function PhishingInbox() {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(scenarioData.emails[0].id);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' } | null>(null);

  const selectedEmail = scenarioData.emails.find((e) => e.id === selectedEmailId) as Email;

  const handleAction = (action: 'scam' | 'safe' | 'link') => {
    if (action === 'link') {
      posthog.capture('scam_clicked', { emailId: selectedEmail.id, reason: 'clicked_link' });
      setFeedback({
        title: scenarioData.feedback.gentleFailure.title,
        message: scenarioData.feedback.gentleFailure.message,
        type: 'failure'
      });
      return;
    }

    if (action === 'scam') {
      if (selectedEmail.isScam) {
        setFeedback({
          title: scenarioData.feedback.success.title,
          message: scenarioData.feedback.success.message,
          type: 'success'
        });
      } else {
        setFeedback({
          title: "Oops! This one is actually safe.",
          message: "It's always good to be cautious! However, this email is from a known friend and doesn't ask for money or demand urgent action.",
          type: 'failure'
        });
      }
    } else if (action === 'safe') {
      if (selectedEmail.isScam) {
        posthog.capture('scam_clicked', { emailId: selectedEmail.id, reason: 'marked_safe' });
        setFeedback({
          title: scenarioData.feedback.gentleFailure.title,
          message: scenarioData.feedback.gentleFailure.message,
          type: 'failure'
        });
      } else {
        setFeedback({
          title: "Great job!",
          message: "You correctly identified that this email is safe. There are no warning signs like urgency or demands for money.",
          type: 'success'
        });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">{scenarioData.title}</h1>
      <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-lg mb-6 text-green-900">
        {scenarioData.description}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 border rounded-lg overflow-hidden bg-white">
          {scenarioData.emails.map((email) => (
            <div 
              key={email.id}
              onClick={() => {
                setSelectedEmailId(email.id);
                setFeedback(null);
              }}
              className={`p-4 border-b cursor-pointer transition-colors ${selectedEmailId === email.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="font-bold text-gray-900">{email.senderName}</div>
              <div className="text-sm text-gray-600">{email.subject}</div>
            </div>
          ))}
        </div>

        <div className="flex-[2] border rounded-lg p-6 bg-white flex flex-col">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-semibold mb-1">{selectedEmail.subject}</h2>
            <div className="text-gray-700">
              <strong>From:</strong> {selectedEmail.senderName} <span className="text-gray-500">&lt;{selectedEmail.senderAddress}&gt;</span>
            </div>
          </div>
          
          <div className="text-lg whitespace-pre-wrap flex-1 mb-8">
            <p className="mb-4">{selectedEmail.body}</p>
            {selectedEmail.linkText && (
              <p>
                <button 
                  onClick={() => handleAction('link')}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  [Link: {selectedEmail.linkText}]
                </button>
              </p>
            )}
          </div>

          <div className="flex gap-4 border-t pt-4">
            <button 
              onClick={() => handleAction('scam')}
              className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition"
            >
              🚨 This is a Scam
            </button>
            <button 
              onClick={() => handleAction('safe')}
              className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700 transition"
            >
              ✅ This is Safe
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full text-center shadow-xl">
            <h3 className={`text-2xl font-bold mb-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback.title}
            </h3>
            <p className="text-lg text-gray-800 whitespace-pre-wrap mb-6">
              {feedback.message}
            </p>
            <button 
              onClick={() => setFeedback(null)}
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
