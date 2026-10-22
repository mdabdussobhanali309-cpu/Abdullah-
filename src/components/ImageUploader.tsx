import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_IMAGES, SampleImage } from '../data/sampleImages';
import { processImageFile, urlToDataUrl } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageSelected: (image: {
    dataUrl: string;
    width: number;
    height: number;
    mimeType: string;
    sizeBytes: number;
    fileName?: string;
  }) => void;
  isLoadingSample?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isLoadingSample = false,
}) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setErrorMessage('অনুগ্রহ করে একটি সঠিক ছবির ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const processed = await processImageFile(file);
      onImageSelected({
        ...processed,
        fileName: file.name,
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'ছবি প্রসেস করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const selectSample = async (sample: SampleImage) => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const processed = await urlToDataUrl(sample.url);
      onImageSelected({
        ...processed,
        fileName: `${sample.title}.jpg`,
      });
    } catch (err) {
      setErrorMessage('নমুনা ছবি লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে নিজস্ব ছবি আপলোড করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Hidden file inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Hero Welcome banner */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Vision চালিত বাংলা গোয়েন্দা</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          কোনো ছবি আপলোড করুন
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          গ্যালারি বা ক্যামেরা থেকে ছবি দিন—আমাদের এআই গোয়েন্দা ছবিতে কী আছে তা নিখুঁতভাবে বাংলায় উন্মোচন করবে।
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Main Upload Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => galleryInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-10 transition-all text-center flex flex-col items-center justify-center gap-4 ${
          dragActive
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-700/80 hover:border-amber-500/50 bg-slate-900/60 hover:bg-slate-900/90'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
          <Upload className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-100">
            গ্যালারি থেকে ছবি বেছে নিতে এখানে ট্যাপ করুন
          </p>
          <p className="text-xs text-slate-400">
            JPG, PNG, WebP বা HEIC (সর্বোচ্চ ২৫ মেগাবাইট)
          </p>
        </div>

        {/* Mobile Quick Action Buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm mt-2 pt-2 border-t border-slate-800/80"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            <span>গ্যালারি নির্বাচন</span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>সরাসরি ছবি তুলুন</span>
          </button>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-amber-300">ছবি প্রসেস হচ্ছে...</span>
          </div>
        )}
      </div>

      {/* Quick Test Sample Images */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            বা তাত্ক্ষণিক পরীক্ষার জন্য একটি নমুনা বেছে নিন
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => selectSample(sample)}
              disabled={isProcessing || isLoadingSample}
              className="group relative flex flex-col text-left rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 hover:border-amber-500/50 hover:bg-slate-850 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
                <img
                  src={sample.thumbnail}
                  alt={sample.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur text-slate-300 font-medium">
                  {sample.category}
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-amber-400">
                  {sample.title}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sample.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
