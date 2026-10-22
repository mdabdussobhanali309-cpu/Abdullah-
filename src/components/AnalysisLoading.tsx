import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Eye, ShieldAlert } from 'lucide-react';

interface AnalysisLoadingProps {
  imageThumbnail?: string;
}

const STEPS = [
  'ছবির ভিজ্যুয়াল ডাটা প্রস্তুত হচ্ছে...',
  'Gemini Vision মডেলের সাথে সংযোগ স্থাপন...',
  'বস্তু, মানুষ ও পরিবেশের উপাদানসমূহ স্ক্যান করা হচ্ছে...',
  'আলো, ছায়া ও রঙের সূক্ষ্ম বিশ্লেষণ চলছে...',
  'সম্ভাব্য অস্পষ্টতা ও অনিশ্চয়তা যাচাই করা হচ্ছে...',
  'গোয়েন্দা অন্তর্দৃষ্টি ও সম্পূর্ণ বাংলা রিপোর্ট সংকলিত হচ্ছে...',
];

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ imageThumbnail }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="w-full py-10 px-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated Detective Magnifier / Radar Screen */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Radar pulses */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
        <div className="absolute inset-3 rounded-full border border-amber-400/30 animate-pulse" />

        {/* Thumbnail backdrop with scanline */}
        {imageThumbnail && (
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-500/50 relative shadow-inner bg-slate-950">
            <img
              src={imageThumbnail}
              alt="তদন্তাধীন ছবি"
              className="w-full h-full object-cover filter blur-[0.5px] scale-110"
            />
            {/* Greenish detective scan bar moving vertically */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce" />
            <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
          </div>
        )}

        {/* Magnifying Glass badge */}
        <div className="absolute -bottom-2 -right-2 p-2.5 rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40">
          <Search className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Text status */}
      <div className="space-y-2 max-w-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>গোয়েন্দা তদন্ত চলছে ({elapsedSeconds} সেকেন্ড)</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          ছবি নিখুঁতভাবে বিশ্লেষণ করা হচ্ছে
        </h3>

        <p className="text-amber-400/90 text-sm font-medium min-h-[24px] transition-all duration-300">
          {STEPS[currentStepIndex]}
        </p>

        <p className="text-slate-400 text-xs">
          Gemini এআই ছবির প্রতিটি কোণ পর্যবেক্ষণ করে বিস্তারিত বাংলা রিপোর্ট তৈরি করছে
        </p>
      </div>

      {/* Progress step dots */}
      <div className="flex items-center gap-1.5 pt-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStepIndex
                ? 'w-6 bg-amber-400'
                : 'w-1.5 bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
