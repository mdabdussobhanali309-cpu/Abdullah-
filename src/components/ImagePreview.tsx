import React, { useState } from 'react';
import { Search, RotateCcw, Maximize2, Minimize2, Info, MessageSquare } from 'lucide-react';
import { formatFileSize } from '../utils/imageUtils';

interface ImagePreviewProps {
  image: {
    dataUrl: string;
    width: number;
    height: number;
    mimeType: string;
    sizeBytes: number;
    fileName?: string;
  };
  onAnalyze: (customNote?: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onAnalyze,
  onClear,
  isAnalyzing,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [showNoteField, setShowNoteField] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Image Preview Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
        <div
          className={`relative w-full flex items-center justify-center bg-slate-950/80 transition-all ${
            isZoomed ? 'min-h-[460px] max-h-[80vh]' : 'min-h-[260px] max-h-[420px]'
          }`}
        >
          <img
            src={image.dataUrl}
            alt="নির্বাচিত ছবি প্রিভিউ"
            className={`max-w-full object-contain transition-all duration-300 ${
              isZoomed ? 'max-h-[80vh]' : 'max-h-[420px]'
            }`}
          />

          {/* Quick overlay controls */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              title={isZoomed ? 'ছোট করুন' : 'বড় করুন'}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 backdrop-blur-md border border-slate-700 shadow-md active:scale-95 transition-all"
            >
              {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={isAnalyzing}
              title="অন্য ছবি বেছে নিন"
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/80 text-rose-300 backdrop-blur-md border border-rose-800/40 shadow-md active:scale-95 transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>পরিবর্তন</span>
            </button>
          </div>

          {/* Image Meta Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="truncate max-w-[180px] sm:max-w-xs font-medium">
              {image.fileName || 'নির্বাচিত ছবি'}
            </span>
            <div className="flex items-center gap-2.5 shrink-0 text-slate-400">
              <span>{image.width} × {image.height} px</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{formatFileSize(image.sizeBytes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Investigation Focus */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 space-y-2">
        <button
          type="button"
          onClick={() => setShowNoteField(!showNoteField)}
          className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-amber-400 font-medium transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            কোনো বিশেষ প্রশ্ন বা নির্দিষ্ট অনুসন্ধানী লক্ষ্য আছে? (ঐচ্ছিক)
          </span>
          <span className="text-amber-400 text-xs">
            {showNoteField ? 'লুকান' : '+ প্রশ্ন যুক্ত করুন'}
          </span>
        </button>

        {showNoteField && (
          <div className="pt-1">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="যেমন: এই ছবিতে কোনো বিশেষ ব্র্যান্ড বা লোগো কি দেখা যাচ্ছে?"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-100 placeholder:text-slate-500"
            />
          </div>
        )}
      </div>

      {/* Primary Action Button: "Analyze Image" (ছবি বিশ্লেষণ করুন) */}
      <button
        type="button"
        disabled={isAnalyzing}
        onClick={() => onAnalyze(customNote)}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base sm:text-lg shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Search className="w-5 h-5 stroke-[2.5]" />
        <span>ছবি বিশ্লেষণ করুন (Analyze Image)</span>
      </button>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        Gemini Vision মডেলের মাধ্যমে ছবিটির সূক্ষ্ম বিশ্লেষণ সম্পূর্ণ বাংলায় প্রস্তুত হবে
      </p>
    </div>
  );
};
