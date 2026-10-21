import React from 'react';

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-serenity-card/60 border border-white/5 rounded-2xl p-6 animate-pulse space-y-4"
        >
          <div className="h-6 bg-white/10 rounded w-2/3"></div>
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-4/5"></div>
          <div className="pt-4 flex justify-between items-center">
            <div className="h-8 bg-white/10 rounded w-24"></div>
            <div className="h-8 bg-white/10 rounded-full w-8"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuranReaderSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-4">
      <div className="h-12 bg-white/10 rounded-2xl w-1/2 mx-auto"></div>
      <div className="h-6 bg-white/5 rounded-xl w-1/3 mx-auto"></div>
      <div className="space-y-4 pt-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-8 bg-white/5 rounded-lg w-full"></div>
        ))}
      </div>
    </div>
  );
}
