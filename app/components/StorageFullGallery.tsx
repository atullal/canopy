"use client";

import React, { useState } from 'react';
import posthog from '../../utils/posthog';
import scenarioData from '../../scenarios/storage-full-gallery.json';

export default function StorageFullGallery() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'failure' | 'info' } | null>(null);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      setFeedback({
        title: "No photos selected",
        message: "Please tap on some photos to select them before clicking Delete.",
        type: 'info'
      });
      return;
    }

    const newlyDeleted = [...deletedIds, ...selectedIds];
    setDeletedIds(newlyDeleted);
    setSelectedIds([]);

    const deletedPhotos = scenarioData.photos.filter(p => newlyDeleted.includes(p.id));
    const deletedKeepers = deletedPhotos.filter(p => p.isKeeper);
    const deletedJunk = deletedPhotos.filter(p => !p.isKeeper);

    if (deletedKeepers.length > 0) {
      posthog.capture('keeper_deleted', { reason: 'deleted_keeper_photo' });
      setFeedback({
        title: scenarioData.feedback.gentleFailureKeeperDeleted.title,
        message: scenarioData.feedback.gentleFailureKeeperDeleted.message,
        type: 'failure'
      });
    } else if (deletedJunk.length < 3) {
      setFeedback({
        title: scenarioData.feedback.gentleFailureNotEnoughDeleted.title,
        message: scenarioData.feedback.gentleFailureNotEnoughDeleted.message,
        type: 'info'
      });
    } else {
      setFeedback({
        title: scenarioData.feedback.success.title,
        message: scenarioData.feedback.success.message,
        type: 'success'
      });
    }
  };

  const handleUndo = () => {
    if (deletedIds.length === 0) return;
    setDeletedIds([]);
    setFeedback({
      title: "Photos Restored",
      message: "Your deleted photos have been brought back from the 'Recently Deleted' folder. You can try selecting the junk photos again!",
      type: 'info'
    });
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'family': return 'bg-pink-200';
      case 'blurry': return 'bg-gray-400 blur-[2px]';
      case 'accidental': return 'bg-gray-800 text-white';
      case 'pet': return 'bg-orange-200';
      case 'duplicate': return 'bg-green-200';
      case 'best-shot': return 'bg-green-300 font-bold';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">{scenarioData.title}</h1>
      <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-lg mb-6 text-green-900">
        {scenarioData.description}
      </div>

      <div className="bg-white p-6 border rounded-xl shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {scenarioData.photos.map((photo) => {
            if (deletedIds.includes(photo.id)) return null;
            const isSelected = selectedIds.includes(photo.id);
            return (
              <div 
                key={photo.id}
                onClick={() => toggleSelect(photo.id)}
                className={`relative aspect-square flex items-center justify-center p-4 text-center cursor-pointer rounded-xl border-4 transition-all duration-200 ${isSelected ? 'border-blue-500 scale-[0.98]' : 'border-transparent hover:opacity-90'} ${getBgColor(photo.type)}`}
              >
                {photo.description}
                {isSelected && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 border-t pt-6">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 transition"
          >
            {scenarioData.actions.find(a => a.id === 'delete')?.label}
          </button>
          <button
            onClick={handleUndo}
            disabled={deletedIds.length === 0}
            className={`flex-1 font-bold py-3 px-4 rounded-xl transition ${deletedIds.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {scenarioData.actions.find(a => a.id === 'undo')?.label}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full text-center shadow-xl">
            <h3 className={`text-2xl font-bold mb-4 ${feedback.type === 'failure' ? 'text-red-600' : feedback.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
              {feedback.title}
            </h3>
            <div className="text-lg text-gray-700 whitespace-pre-wrap mb-6 text-left">
              {feedback.message}
            </div>
            <button 
              onClick={() => setFeedback(null)}
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
