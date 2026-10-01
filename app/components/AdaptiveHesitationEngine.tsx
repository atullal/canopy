"use client";

import React, { useState, useEffect, useRef } from 'react';

interface AdaptiveHesitationEngineProps {
  children: React.ReactNode;
  hintContent: React.ReactNode;
  idleTimeMs?: number; // Defaults to 10 seconds (10000)
}

export default function AdaptiveHesitationEngine({ children, hintContent, idleTimeMs = 10000 }: AdaptiveHesitationEngineProps) {
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    setShowHint(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setShowHint(true);
    }, idleTimeMs);
  };

  useEffect(() => {
    // Start the timer when the component mounts
    resetTimer();

    // Reset the timer on user interaction
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleActivity = () => resetTimer();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [idleTimeMs]);

  return (
    <div className="relative w-full h-full">
      {children}
      {showHint && (
        <div className="absolute bottom-4 right-4 max-w-sm bg-yellow-100 border-l-4 border-yellow-500 p-4 shadow-lg rounded z-50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-bold text-yellow-800 mb-1 text-xl">Stuck? Here's a hint:</h4>
              <div className="text-xl text-yellow-900">{hintContent}</div>
            </div>
            <button 
              onClick={() => setShowHint(false)}
              className="ml-4 text-yellow-700 hover:text-yellow-900 font-bold min-w-[56px] min-h-[56px] flex items-center justify-center bg-yellow-200 rounded-full hover:bg-yellow-300 transition"
              aria-label="Dismiss hint"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}