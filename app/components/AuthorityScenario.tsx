"use client";

import React, { useState } from 'react';
import AdaptiveHesitationEngine from './AdaptiveHesitationEngine';
import SplitScreenCompare from './SplitScreenCompare';

type ActionType = "primary" | "danger";

interface Action {
  id: string;
  label: string;
  type: ActionType;
}

interface Challenge {
  id: string;
  sender: string;
  body: string;
  isManipulation: boolean;
  manipulationType: string;
  justInTimeHint: string;
}

interface FeedbackConfig {
  title: string;
  message: string;
}

interface Feedback {
  gentleFailureMissedManipulation: FeedbackConfig;
  gentleFailureFlaggedSafe: FeedbackConfig;
  success: FeedbackConfig;
}

interface ScenarioData {
  id: string;
  title: string;
  description: string;
  actions: Action[];
  challenges: Challenge[];
  feedback: Feedback;
}

export default function AuthorityScenario({ data }: { data: ScenarioData }) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackConfig | null>(null);

  const currentChallenge = data.challenges[currentChallengeIndex];

  const handleAction = (actionId: string) => {
    if (actionId === 'manipulation') {
      if (currentChallenge.isManipulation) {
        if (currentChallengeIndex < data.challenges.length - 1) {
          setCurrentChallengeIndex(prev => prev + 1);
        } else {
          setFeedback(data.feedback.success);
        }
      } else {
        setFeedback(data.feedback.gentleFailureFlaggedSafe);
      }
    } else if (actionId === 'safe') {
      if (!currentChallenge.isManipulation) {
        if (currentChallengeIndex < data.challenges.length - 1) {
          setCurrentChallengeIndex(prev => prev + 1);
        } else {
          setFeedback(data.feedback.success);
        }
      } else {
        setFeedback(data.feedback.gentleFailureMissedManipulation);
      }
    }
  };

  const resetFeedback = () => setFeedback(null);

  if (feedback) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-blue-50 border-l-8 border-blue-600 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">{feedback.title}</h2>
        <p className="text-xl text-blue-800 leading-relaxed mb-8">{feedback.message}</p>
        <button 
          onClick={resetFeedback}
          className="min-w-[56px] min-h-[56px] px-8 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
        >
          Continue Practice
        </button>
      </div>
    );
  }

  return (
    <AdaptiveHesitationEngine hintContent={currentChallenge.justInTimeHint}>
      <div className="max-w-5xl mx-auto py-8">
        <header className="mb-8 text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.title}</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">{data.description}</p>
        </header>

        <SplitScreenCompare
          leftContent={
            <div className="flex flex-col h-full">
              <div className="bg-gray-100 p-4 border-b border-gray-300 rounded-t-lg">
                <h3 className="text-2xl font-bold text-gray-900">Message from: {currentChallenge.sender}</h3>
              </div>
              <div className="p-6 flex-1 flex items-center justify-center bg-gray-50 rounded-b-lg">
                <p className="text-2xl text-gray-800 font-medium leading-relaxed">"{currentChallenge.body}"</p>
              </div>
            </div>
          }
          rightContent={
            <div className="flex flex-col justify-center h-full space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">What should you do?</h3>
              {data.actions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`w-full min-h-[64px] text-xl font-bold rounded-lg transition px-6 ${
                    action.type === 'danger' 
                      ? 'bg-red-100 text-red-900 border-2 border-red-500 hover:bg-red-200 focus:ring-4 focus:ring-red-300' 
                      : 'bg-green-100 text-green-900 border-2 border-green-500 hover:bg-green-200 focus:ring-4 focus:ring-green-300'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          }
        />
        
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600 font-medium">Challenge {currentChallengeIndex + 1} of {data.challenges.length}</p>
        </div>
      </div>
    </AdaptiveHesitationEngine>
  );
}
