"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <main className="max-w-5xl mx-auto p-4 md:p-8 font-sans text-gray-900 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black">
          {scenarioData.title}
        </h1>
        <div 
          role="region" 
          aria-label="Scenario Description"
          className="bg-white border-4 border-blue-100 p-6 rounded-2xl text-xl leading-relaxed text-gray-800 shadow-sm"
        >
          {scenarioData.description}
        </div>
      </header>

      <section className="flex flex-col lg:flex-row gap-8">
        {/* Inbox List */}
        <div className="flex-1 border-2 border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
          <h2 className="sr-only">Inbox</h2>
          <ul className="flex flex-col w-full" role="listbox" aria-label="Emails">
            {scenarioData.emails.map((email) => {
              const isSelected = selectedEmailId === email.id;
              return (
                <li key={email.id} className="border-b-2 border-gray-100 last:border-b-0">
                  <button
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedEmailId(email.id);
                      setFeedback(null);
                    }}
                    className={`w-full text-left p-6 min-h-[5rem] transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-inset
                      ${isSelected ? 'bg-blue-50 border-l-8 border-l-blue-600' : 'bg-white hover:bg-gray-100 active:bg-gray-200 border-l-8 border-l-transparent'}`}
                  >
                    <div className="text-xl font-bold text-black mb-1 truncate">{email.senderName}</div>
                    <div className={`text-lg truncate ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {email.subject}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Email Reading Pane */}
        <article className="flex-[2] border-2 border-gray-300 rounded-2xl p-6 md:p-8 bg-white shadow-sm flex flex-col">
          <header className="border-b-2 border-gray-200 pb-6 mb-6">
            <h2 className="text-3xl font-bold mb-3 text-black leading-tight">{selectedEmail.subject}</h2>
            <div className="text-xl text-gray-800">
              <strong className="font-bold">From:</strong> {selectedEmail.senderName}{' '}
              <span className="text-gray-600 font-medium">&lt;{selectedEmail.senderAddress}&gt;</span>
            </div>
          </header>
          
          <div className="text-2xl leading-relaxed flex-1 mb-10 text-gray-900 whitespace-pre-wrap">
            <p className="mb-6">{selectedEmail.body}</p>
            {selectedEmail.linkText && (
              <div className="mt-8">
                <button 
                  onClick={() => handleAction('link')}
                  className="inline-block text-blue-700 underline decoration-2 underline-offset-4 font-bold hover:text-blue-900 hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
                >
                  [Link: {selectedEmail.linkText}]
                </button>
              </div>
            )}
          </div>

          <footer className="flex flex-col sm:flex-row gap-4 border-t-2 border-gray-200 pt-6">
            <button 
              onClick={() => handleAction('scam')}
              className="flex-1 bg-red-100 text-red-900 border-2 border-red-700 font-bold text-xl py-5 px-6 rounded-xl hover:bg-red-200 hover:border-red-800 active:bg-red-300 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 focus-visible:ring-offset-2 min-h-[4rem]"
            >
              🚨 This is a Scam
            </button>
            <button 
              onClick={() => handleAction('safe')}
              className="flex-1 bg-green-100 text-green-900 border-2 border-green-700 font-bold text-xl py-5 px-6 rounded-xl hover:bg-green-200 hover:border-green-800 active:bg-green-300 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600 focus-visible:ring-offset-2 min-h-[4rem]"
            >
              ✅ This is Safe
            </button>
          </footer>
        </article>
      </section>

      {/* Feedback Modal with Framer Motion */}
      <AnimatePresence>
        {feedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={() => setFeedback(null)}
              aria-hidden="true"
            />
            
            {/* Modal Content */}
            <motion.div 
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 25, 
                mass: 1 
              }}
              className="relative bg-white border-4 border-gray-200 p-8 md:p-12 rounded-3xl max-w-2xl w-full text-center shadow-2xl"
            >
              <h3 className={`text-3xl md:text-4xl font-extrabold mb-6 ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.title}
              </h3>
              <p className="text-2xl text-gray-900 leading-relaxed whitespace-pre-wrap mb-10">
                {feedback.message}
              </p>
              <button 
                onClick={() => setFeedback(null)}
                autoFocus
                className="w-full sm:w-auto min-w-[12rem] bg-blue-700 text-white font-bold text-2xl py-5 px-10 rounded-xl hover:bg-blue-800 active:bg-blue-900 active:scale-95 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-4 shadow-md"
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
