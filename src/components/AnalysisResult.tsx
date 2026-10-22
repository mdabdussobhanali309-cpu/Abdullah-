import React, { useState } from 'react';
import {
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ShieldAlert,
  Sparkles,
  Layers,
  Palette,
  Sun,
  MapPin,
  FileText,
  HelpCircle,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { DetectiveReport } from '../types/detective';

interface AnalysisResultProps {
  report: DetectiveReport;
  imageDataUrl: string;
  onReset: () => void;
  fileName?: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  report,
  imageDataUrl,
  onReset,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'উচ্চ' | 'মাঝারি' | 'কম'>('all');
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  // Copy full Bengali report to clipboard
  const handleCopy = async () => {
    const textToCopy = `[চিত্র গোয়েন্দা এআই রিপোর্ট]
শিরোনাম: ${report.title}
ক্যাটাগরি: ${report.category}

বিবরণ:
${report.overallDescription}

সনাক্তকৃত উপাদানসমূহ:
${report.detectedObjects
  .map(
    (obj, i) =>
      `${i + 1}. ${obj.nameBengali} (${obj.nameEnglish}) - নিশ্চয়তা: ${obj.confidence} [অবস্থান: ${obj.location}]\n   ${obj.description}`
  )
  .join('\n')}

ভিজ্যুয়াল বিশদ:
- রং: ${report.visualDetails.colors.join(', ')}
- আলো: ${report.visualDetails.lighting}
- পটভূমি: ${report.visualDetails.setting}
- লিখিত টেক্সট: ${report.visualDetails.detectedText}
- ছবির মাধ্যম: ${report.visualDetails.sceneType}

অনিশ্চয়তা ও অস্পষ্টতা:
${report.uncertainties.join('\n')}

গোয়েন্দা অন্তর্দৃষ্টি:
${report.detectiveInsights}
`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Text to speech in Bengali if supported by browser
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${report.title}। ${report.overallDescription}। গোয়েন্দা পর্যবেক্ষণ: ${report.detectiveInsights}`
    );
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const filteredObjects =
    confidenceFilter === 'all'
      ? report.detectedObjects
      : report.detectedObjects.filter((o) => o.confidence.includes(confidenceFilter));

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Banner: Success Title & Category */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                {report.category || 'বিশ্লেষিত'}
              </span>
              <span className="text-xs text-slate-400">
                • {report.detectedObjects.length} টি উপাদান শনাক্ত
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {report.title}
            </h2>
          </div>

          {/* Quick utility tools: Copy, Speak */}
          <div className="flex items-center gap-2 self-start">
            {'speechSynthesis' in window && (
              <button
                type="button"
                onClick={toggleSpeech}
                title={isSpeaking ? 'পড়া বন্ধ করুন' : 'বাংলায় পড়ে শুনুন'}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 active:scale-95 transition-all ${
                  isSpeaking
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>বন্ধ করুন</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">শুনুন</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 active:scale-95 transition-all"
              title="সম্পূর্ণ রিপোর্ট কপি করুন"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">কপি রিপোর্ট</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-side or stacked Image Preview & Overall Description */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Thumbnail Card */}
        <div className="md:col-span-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-2 shadow-lg group relative">
          <div
            onClick={() => setShowFullImageModal(true)}
            className="cursor-pointer relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center"
          >
            <img
              src={imageDataUrl}
              alt="তদন্তকৃত ছবি"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
              <span className="text-xs text-amber-300 font-medium flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-700">
                <Eye className="w-3.5 h-3.5" /> বড় করে দেখতে ট্যাপ করুন
              </span>
            </div>
          </div>
          {fileName && (
            <p className="text-[11px] text-slate-400 truncate px-2 pt-2">
              ফাইল: {fileName}
            </p>
          )}
        </div>

        {/* Overall Description Card */}
        <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <FileText className="w-4 h-4" />
            <span>ছবির সামগ্রিক বিবরণ (Overall Description)</span>
          </div>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
            {report.overallDescription}
          </p>
        </div>
      </div>

      {/* Section 1: Detected Objects */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              সনাক্তকৃত উপাদান ও বস্তুসমূহ (Detected Objects)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {report.detectedObjects.length}
            </span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setConfidenceFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                confidenceFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              সকল
            </button>
            <button
              type="button"
              onClick={() => setConfidenceFilter('উচ্চ')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                confidenceFilter === 'উচ্চ'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300 border border-slate-700'
              }`}
            >
              উচ্চ নিশ্চয়তা
            </button>
            <button
              type="button"
              onClick={() => setConfidenceFilter('মাঝারি')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                confidenceFilter === 'মাঝারি'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-amber-300 border border-slate-700'
              }`}
            >
              মাঝারি
            </button>
            <button
              type="button"
              onClick={() => setConfidenceFilter('কম')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                confidenceFilter === 'কম'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-rose-300 border border-slate-700'
              }`}
            >
              কম
            </button>
          </div>
        </div>

        {/* Objects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredObjects.map((obj, index) => {
            const isHigh = obj.confidence.includes('উচ্চ');
            const isMed = obj.confidence.includes('মাঝারি');
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 p-3.5 space-y-2 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {obj.nameBengali}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {obj.nameEnglish}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                        isHigh
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : isMed
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {obj.confidence} নিশ্চয়তা
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-normal">
                    {obj.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">অবস্থান: {obj.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Visual & Environmental Details */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Palette className="w-4 h-4" />
          <span>ভিজ্যুয়াল বিশদ ও পরিবেশগত তথ্য (Visual Details)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Colors */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" /> প্রধান রং
            </span>
            <div className="flex flex-wrap gap-1.5">
              {report.visualDetails.colors.map((color, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Lighting */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> আলোর ধরন
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {report.visualDetails.lighting}
            </p>
          </div>

          {/* Setting */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> পটভূমি ও পরিবেশ
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {report.visualDetails.setting}
            </p>
          </div>

          {/* Detected Text & Scene Type */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" /> টেক্সট ও মাধ্যম
            </span>
            <div className="space-y-1">
              <p className="text-xs text-slate-200">
                <span className="text-slate-400">লেখা:</span> {report.visualDetails.detectedText}
              </p>
              <p className="text-xs text-slate-300">
                <span className="text-slate-400">মাধ্যম:</span> {report.visualDetails.sceneType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Uncertainties & Ambiguities (Exact prompt requirement) */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>অনিশ্চয়তা ও অস্পষ্টতার মূল্যায়ন (Uncertainty Analysis)</span>
        </div>
        <p className="text-xs text-amber-200/80">
          এআই গোয়েন্দা ছবির কোনো অংশ অস্পষ্ট, ঝাপসা বা সন্দেহযুক্ত থাকলে তা সততার সাথে নিম্নে তুলে ধরে:
        </p>

        <div className="space-y-2">
          {report.uncertainties.map((unc, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs sm:text-sm text-slate-200"
            >
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{unc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Detective Insights */}
      {report.detectiveInsights && (
        <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-5 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-sky-300 font-bold text-base">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>গোয়েন্দা অন্তর্দৃষ্টি (Detective Insights)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-900/60 p-3.5 rounded-xl border border-sky-500/20">
            {report.detectiveInsights}
          </p>
        </div>
      )}

      {/* Bottom Sticky Action Bar: "Upload and analyze another image" */}
      <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>আরেকটি ছবি বিশ্লেষণ করুন (Analyze Another Image)</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{copied ? 'কপি সম্পন্ন!' : 'রিপোর্ট শেয়ার/কপি'}</span>
        </button>
      </div>

      {/* Full image viewer modal */}
      {showFullImageModal && (
        <div
          onClick={() => setShowFullImageModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl relative">
            <img
              src={imageDataUrl}
              alt="পূর্ণ আকারের ছবি"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
