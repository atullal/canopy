"use client";

import React from 'react';

interface SplitScreenCompareProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export default function SplitScreenCompare({ leftContent, rightContent }: SplitScreenCompareProps) {
  return (
    <div className="flex flex-col md:flex-row w-full gap-4 p-4">
      <div className="flex-1 bg-white border border-gray-300 rounded-lg p-6 shadow-sm min-h-[300px]">
        {leftContent}
      </div>
      <div className="hidden md:flex items-center justify-center -mx-6 z-10 w-8 bg-gray-50">
        <div className="w-px h-full bg-gray-300 absolute" />
      </div>
      <div className="flex-1 bg-white border border-gray-300 rounded-lg p-6 shadow-sm min-h-[300px]">
        {rightContent}
      </div>
    </div>
  );
}
