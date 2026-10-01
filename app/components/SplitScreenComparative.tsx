"use client";

import React from 'react';

interface SplitScreenComparativeProps {
  leftTitle: string;
  leftContent: React.ReactNode;
  rightTitle: string;
  rightContent: React.ReactNode;
}

export default function SplitScreenComparative({ leftTitle, leftContent, rightTitle, rightContent }: SplitScreenComparativeProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto p-4">
      <div className="flex-1 border-2 border-red-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
        <div className="bg-red-100 text-red-900 font-bold p-3 text-center border-b-2 border-red-300">
          {leftTitle}
        </div>
        <div className="p-6 flex-1">
          {leftContent}
        </div>
      </div>
      
      <div className="flex-1 border-2 border-green-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
        <div className="bg-green-100 text-green-900 font-bold p-3 text-center border-b-2 border-green-300">
          {rightTitle}
        </div>
        <div className="p-6 flex-1">
          {rightContent}
        </div>
      </div>
    </div>
  );
}