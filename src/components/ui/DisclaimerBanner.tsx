"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface DisclaimerBannerProps {
  message?: string;
  dismissible?: boolean;
}

export function DisclaimerBanner({ 
  message = "Download links may vary or be unavailable depending on whether the developer has updated them. Always verify downloads from trusted sources.",
  dismissible = true 
}: DisclaimerBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-200 flex-1">
          {message}
        </p>
        {dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className="text-amber-400 hover:text-amber-300 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

