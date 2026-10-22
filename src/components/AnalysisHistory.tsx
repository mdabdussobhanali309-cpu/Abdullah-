import React from 'react';
import { X, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { AnalysisHistoryItem } from '../types/detective';

interface AnalysisHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  items: AnalysisHistoryItem[];
  onSelectItem: (item: AnalysisHistoryItem) => void;
  onClearHistory: () => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col z-10 shadow-2xl">
        {/* Drawer header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">
              পূর্ববর্তী তদন্তের ইতিহাস
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
              {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="ইতিহাস মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <p className="text-sm">কোনো পূর্ববর্তী বিশ্লেষণ পাওয়া যায়নি।</p>
              <p className="text-xs text-slate-500">
                ছবি বিশ্লেষণ করার সাথে সাথে এখানে ইতিহাস সংরক্ষিত থাকবে।
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="cursor-pointer group flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all active:scale-[0.99]"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  <img
                    src={item.imageThumbnail}
                    alt={item.report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                      {item.report.category}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-amber-400">
                    {item.report.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {item.report.detectedObjects.length} টি উপাদান • {item.report.overallDescription}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
