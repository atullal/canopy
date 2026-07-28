"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/fake-checkout.json';

export default function FakeCheckout() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' } | null>(null);

  const currentChallenge = scenarioData.challenges[challengeIndex];

  const handleNextChallenge = () => {
    setFeedback(null);
    setSelectedPayment('');
    if (challengeIndex + 1 < scenarioData.challenges.length) {
      setChallengeIndex(challengeIndex + 1);
    } else {
      setChallengeIndex(0); // Restart
    }
  };

  const submitPayment = () => {
    if (!selectedPayment) {
      setFeedback({
        title: "Please select a payment method",
        message: "You need to choose how to pay before submitting.",
        type: 'failure'
      });
      return;
    }

    if (!currentChallenge.isLegitimate) {
      // Failed: Tried to pay on a fake site
      posthog.capture('scam_clicked', { challengeId: currentChallenge.id, reason: 'paid_on_fake_site' });
      setFeedback({
        title: scenarioData.feedback.gentleFailureFakeSite.title,
        message: scenarioData.feedback.gentleFailureFakeSite.message,
        type: 'failure'
      });
    } else {
      // Real site: check payment method
      const paymentOption = scenarioData.paymentOptions.find((p: any) => p.id === selectedPayment);
      if (!paymentOption?.isSafe) {
        posthog.capture('scam_clicked', { challengeId: currentChallenge.id, reason: 'unsafe_payment_method', paymentMethod: selectedPayment });
        setFeedback({
          title: scenarioData.feedback.gentleFailureUnsafePayment.title,
          message: scenarioData.feedback.gentleFailureUnsafePayment.message,
          type: 'failure'
        });
      } else {
        // Success
        setFeedback({
          title: scenarioData.feedback.success.title,
          message: scenarioData.feedback.success.message,
          type: 'success'
        });
      }
    }
  };

  const leaveWebsite = () => {
    if (!currentChallenge.isLegitimate) {
      setFeedback({
        title: "Great job!",
        message: `You noticed that the website address (${currentChallenge.urlBar}) was a fake copycat and you correctly decided to leave. Let's move on!`,
        type: 'success'
      });
    } else {
      setFeedback({
        title: "Oops! This was the real store.",
        message: `The address bar says '${currentChallenge.urlBar}', which is the real store. It's perfectly safe to buy things here, as long as you pick the safest payment method. Try again and select a payment method this time!`,
        type: 'failure'
      });
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 font-sans text-gray-900 bg-gray-50 min-h-screen">
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

      <AnimatePresence mode="wait">
        <motion.div 
          key={challengeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="border-4 border-gray-300 rounded-2xl bg-gray-50 overflow-hidden shadow-md"
        >
          {/* Extremely Prominent Browser Bar */}
          <div className="bg-gray-200 p-4 sm:p-6 border-b-4 border-gray-300 flex items-center">
            <div className="hidden sm:flex gap-3 mr-6">
              <div className="w-5 h-5 rounded-full bg-red-400"></div>
              <div className="w-5 h-5 rounded-full bg-yellow-400"></div>
              <div className="w-5 h-5 rounded-full bg-green-400"></div>
            </div>
            
            <div 
              className="bg-white px-6 py-4 rounded-xl flex-1 flex items-center gap-4 border-4 border-gray-800 shadow-inner"
              aria-label="Browser Address Bar"
              role="textbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              <div className="font-mono text-2xl md:text-3xl font-extrabold text-black tracking-widest break-all">
                {currentChallenge.urlBar}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 md:p-10 bg-white">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-black border-b-2 border-gray-200 pb-4">
              Secure Checkout
            </h2>
            
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl mb-10 text-gray-900 text-xl">
              <strong className="block text-2xl mb-2 font-bold">Shopping Cart Summary:</strong>
              <span className="leading-relaxed">{currentChallenge.cartSummary}</span>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-black">How would you like to pay?</h3>
              <div className="space-y-4" role="radiogroup" aria-label="Payment Options">
                {scenarioData.paymentOptions.map((option: any) => {
                  const isSelected = selectedPayment === option.id;
                  return (
                    <label 
                      key={option.id} 
                      className={`flex items-center p-5 rounded-xl cursor-pointer transition-colors border-2 ${
                        isSelected 
                          ? 'bg-blue-100 border-blue-600' 
                          : 'bg-white border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only" // hidden but accessible, styled custom radio below
                        aria-label={option.label}
                      />
                      <div className={`w-8 h-8 rounded-full border-4 flex-shrink-0 mr-6 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-blue-700 bg-white' : 'border-gray-400 bg-gray-50'
                      }`}>
                        {isSelected && <div className="w-3 h-3 bg-blue-700 rounded-full" />}
                      </div>
                      <span className={`text-2xl ${isSelected ? 'font-bold text-blue-900' : 'font-medium text-gray-800'}`}>
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={submitPayment}
                className="flex-1 bg-green-100 text-green-900 border-2 border-green-700 font-bold text-2xl py-6 px-4 rounded-xl hover:bg-green-200 active:bg-green-300 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600 min-h-[5rem] shadow-sm"
              >
                🛒 Submit Payment
              </button>
              <button
                onClick={leaveWebsite}
                className="flex-1 bg-red-100 text-red-900 border-2 border-red-700 font-bold text-2xl py-6 px-4 rounded-xl hover:bg-red-200 active:bg-red-300 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 min-h-[5rem] shadow-sm"
              >
                🛑 Leave this Website
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modal with Framer Motion */}
      <AnimatePresence>
        {feedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
              className="relative bg-white border-4 border-gray-200 p-8 md:p-12 rounded-3xl max-w-3xl w-full text-center shadow-2xl"
            >
              <h3 className={`text-4xl md:text-5xl font-extrabold mb-8 ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
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
