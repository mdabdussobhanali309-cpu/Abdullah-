import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Smartphone, Eye } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              Image Detective AI কীভাবে কাজ করে?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Feature 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <Smartphone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white">মোবাইল গ্যালারি ও ক্যামেরা</h4>
              <p className="text-slate-400 text-xs">
                যেকোনো স্মার্টফোন বা কম্পিউটার থেকে সরাসরি ছবি আপলোড করুন অথবা ক্যামেরা দিয়ে তাৎক্ষণিক ছবি তুলে প্রিভিউ দেখুন।
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <Eye className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white">Gemini Vision ভিজ্যুয়াল তদন্ত</h4>
              <p className="text-slate-400 text-xs">
                গুগলের সর্বশেষ Gemini Vision মাল্টিমোডাল মডেল ছবির ভেতর দৃশ্যমান প্রতিটি উপাদান, মানুষ, বস্তু, রং, আলোকসজ্জা ও পরিবেশ নিখুঁতভাবে বিশ্লেষণ করে।
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white">সততা ও অনিশ্চয়তার রিপোর্ট</h4>
              <p className="text-slate-400 text-xs">
                ছবিতে কোনো অংশ যদি ঝাপসা, ছায়াবৃত বা অস্পষ্ট হয়, এআই কোনো মিথ্যা অনুমান না করে সততার সাথে অনিশ্চয়তা নোট প্রকাশ করে। কোনো ভুয়া ওয়েব সার্চের ভান করা হয় না।
              </p>
            </div>
          </div>

          {/* Testing Tips */}
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 space-y-1.5">
            <h5 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4" /> প্রিভিউ এবং পরীক্ষার নির্দেশনা
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
              <li>হোম স্ক্রিনের নিচে দেওয়া নমুনা ছবিগুলোতে ট্যাপ করে এক ক্লিকেই পরীক্ষা করতে পারেন।</li>
              <li>আপনার ফোন গ্যালারি থেকে যেকোনো ছবি নির্বাচন করে &quot;ছবি বিশ্লেষণ করুন&quot; বোতাম চাপুন।</li>
              <li>ফলাফল আসার পর স্পিকার আইকনে ট্যাপ করে বাংলায় শুনে নিতে পারেন।</li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs active:scale-95 transition-all"
        >
          ঠিক আছে, বুঝেছি
        </button>
      </div>
    </div>
  );
};
