import React from 'react';
import { Search, Sparkles, History, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenHelp,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-md shadow-amber-500/20">
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                Image Detective AI
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                  বাংলা
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              চিত্র গোয়েন্দা • নিখুঁত ভিজ্যুয়াল বিশ্লেষণ
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {historyCount > 0 && (
            <button
              onClick={onOpenHistory}
              title="পূর্ববর্তী তদন্তের ইতিহাস"
              className="relative p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 active:scale-95 transition-all text-xs flex items-center gap-1.5"
              aria-label="ইতিহাস দেখুন"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">ইতিহাস</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-semibold bg-amber-500 text-slate-950 rounded-full">
                {historyCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenHelp}
            title="কীভাবে ব্যবহার করবেন"
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 active:scale-95 transition-all text-xs flex items-center gap-1"
            aria-label="সাহায্য"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">সহায়তা</span>
          </button>
        </div>
      </div>
    </header>
  );
};
