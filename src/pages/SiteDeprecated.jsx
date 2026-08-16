import { Check, Copy, ExternalLink, ShieldAlert } from 'lucide-react';
import React, { useState } from 'react';

export default function SiteDeprecated() {
  const [copied, setCopied] = useState(false);
  const portalUrl = 'https://pwa.decentcareportal.com.au/';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback copy mechanism
      const textArea = document.createElement('textarea');
      textArea.value = portalUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex flex-col justify-between items-center font-sans text-slate-800 antialiased p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Subtle Ambient Background Accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Card Container */}
      <div className="w-full max-w-sm my-auto bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/70 p-6 sm:p-8 text-center flex flex-col items-center">
        {/* Notice Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold mb-6">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>App Discontinued</span>
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-3">
          This site is no longer active.
        </h1>

        {/* Body Text */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          Visit our new app at{' '}
          <span className="font-semibold text-slate-800 lowercase">
            pwa.decentcareportal.com.au
          </span>{' '}
          to access your updated mobile experience.
        </p>

        {/* Primary CTA Button */}
        <a
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-[0.99] text-white font-semibold text-sm sm:text-base transition-all duration-150 shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 mb-3"
        >
          <span>Open New App</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Copy URL Button */}
        <button
          onClick={handleCopy}
          type="button"
          className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200/80 text-slate-700 font-medium text-xs transition-all duration-150 flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">
                URL Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy App URL</span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-sm text-center py-3 text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} Decent Care. All rights reserved.
      </footer>
    </div>
  );
}
