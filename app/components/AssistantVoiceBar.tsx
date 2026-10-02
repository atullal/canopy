"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssistantVoiceBarProps {
  textToSpeak: string;
  targetHighlightId?: string; // The ID of the element on screen to pulse
  onSpeechEnd?: () => void;
}

export default function AssistantVoiceBar({ textToSpeak, targetHighlightId, onSpeechEnd }: AssistantVoiceBarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!synthRef.current || !textToSpeak) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // Try to pick a friendly English voice
    const voices = synthRef.current.getVoices();
    const friendlyVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English')));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for older adults
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Trigger visual highlight by adding a class to the target element
      if (targetHighlightId) {
        const el = document.getElementById(targetHighlightId);
        if (el) {
          el.classList.add('v4-highlight-pulse');
        }
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Remove visual highlight
      if (targetHighlightId) {
        const el = document.getElementById(targetHighlightId);
        if (el) {
          el.classList.remove('v4-highlight-pulse');
        }
      }
      if (onSpeechEnd) onSpeechEnd();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);

    // Cleanup on unmount or text change
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (targetHighlightId) {
        const el = document.getElementById(targetHighlightId);
        if (el) {
          el.classList.remove('v4-highlight-pulse');
        }
      }
    };
  }, [textToSpeak, targetHighlightId]);

  return (
    <AnimatePresence>
      {textToSpeak && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-blue-500 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-50 rounded-t-3xl max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 relative">
              <span className="text-3xl">🎙️</span>
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-50"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-2xl text-gray-800 font-medium leading-relaxed">
                {textToSpeak}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
