import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { AnalysisLoading } from './components/AnalysisLoading';
import { AnalysisResult } from './components/AnalysisResult';
import { AnalysisHistory } from './components/AnalysisHistory';
import { HelpModal } from './components/HelpModal';
import { DetectiveReport, AnalysisHistoryItem } from './types/detective';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SelectedImageState {
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  sizeBytes: number;
  fileName?: string;
}

const STORAGE_KEY = 'image_detective_history_v1';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<SelectedImageState | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<DetectiveReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Load history from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newReport: DetectiveReport, image: SelectedImageState) => {
    const newItem: AnalysisHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      imageThumbnail: image.dataUrl,
      report: newReport,
      fileName: image.fileName,
      fileSizeFormatted: `${Math.round(image.sizeBytes / 1024)} KB`,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 15);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage limit reached for history', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear history from localStorage', e);
    }
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setSelectedImage({
      dataUrl: item.imageThumbnail,
      width: 800,
      height: 600,
      mimeType: 'image/jpeg',
      sizeBytes: 100000,
      fileName: item.fileName,
    });
    setReport(item.report);
    setError(null);
  };

  const handleImageSelected = (img: SelectedImageState) => {
    setSelectedImage(img);
    setReport(null);
    setError(null);
  };

  const handleAnalyze = async (customNote?: string) => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage.dataUrl,
          mimeType: selectedImage.mimeType,
          note: customNote,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'ছবি বিশ্লেষণে ত্রুটি ঘটেছে।');
      }

      setReport(json.data);
      saveToHistory(json.data, selectedImage);
    } catch (err: unknown) {
      console.error('Analysis failed:', err);
      const msg = err instanceof Error ? err.message : 'অপ্রত্যাশিত কোনো ত্রুটি ঘটেছে।';
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* App Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        historyCount={history.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-300">বিশ্লেষণ ব্যর্থ হয়েছে</h4>
                <p className="text-xs sm:text-sm text-rose-200/90">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleAnalyze()}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-500/30 flex items-center gap-1.5 active:scale-95 transition-all self-end sm:self-center shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>পুনরায় চেষ্টা করুন</span>
            </button>
          </div>
        )}

        {/* State Machine:
            1. If Analyzing -> show loading state
            2. Else if Report exists -> show report result
            3. Else if Image selected -> show image preview with Analyze button
            4. Else -> show Image Uploader (Gallery / Camera / Samples)
        */}
        {isAnalyzing ? (
          <AnalysisLoading imageThumbnail={selectedImage?.dataUrl} />
        ) : report && selectedImage ? (
          <AnalysisResult
            report={report}
            imageDataUrl={selectedImage.dataUrl}
            onReset={handleReset}
            fileName={selectedImage.fileName}
          />
        ) : selectedImage ? (
          <ImagePreview
            image={selectedImage}
            onAnalyze={handleAnalyze}
            onClear={handleReset}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <ImageUploader onImageSelected={handleImageSelected} />
        )}
      </main>

      {/* Mobile-friendly Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Image Detective AI • গুগল জেমিনাই ভিশন চালিত</p>
          <p className="text-slate-600">
            Android ও মোবাইল ব্রাউজারের জন্য বিশেষ অপ্টিমাইজড
          </p>
        </div>
      </footer>

      {/* History Drawer */}
      <AnalysisHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelectItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
