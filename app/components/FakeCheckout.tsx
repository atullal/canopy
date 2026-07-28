"use client";

import React, { useState } from 'react';
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
      const paymentOption = scenarioData.paymentOptions.find(p => p.id === selectedPayment);
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
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">{scenarioData.title}</h1>
      <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-lg mb-6 text-green-900">
        {scenarioData.description}
      </div>

      <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden shadow-sm">
        {/* Browser Bar */}
        <div className="bg-gray-200 p-3 border-b border-gray-300 flex items-center">
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          </div>
          <div className="bg-white px-4 py-2 rounded-full flex-1 font-mono text-lg text-gray-800 border border-gray-300">
            {currentChallenge.urlBar}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 bg-white">
          <h2 className="text-2xl font-semibold mb-4">Secure Checkout</h2>
          
          <div className="bg-gray-100 p-4 rounded-md mb-6 text-gray-800">
            <strong>Shopping Cart:</strong><br />
            {currentChallenge.cartSummary}<br />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">How would you like to pay?</h3>
            <div className="space-y-3">
              {scenarioData.paymentOptions.map(option => (
                <label key={option.id} className="flex items-center text-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={selectedPayment === option.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mr-3 w-5 h-5"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={submitPayment}
              className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700 transition"
            >
              🛒 Submit Payment
            </button>
            <button
              onClick={leaveWebsite}
              className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition"
            >
              🛑 Leave this Website
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {feedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full text-center shadow-xl">
            <h3 className={`text-2xl font-bold mb-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback.title}
            </h3>
            <div className="text-lg text-gray-800 whitespace-pre-wrap mb-6 text-left">
              {feedback.message}
            </div>
            <button 
              onClick={handleNextChallenge}
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
