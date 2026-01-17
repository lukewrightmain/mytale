"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-surface-elevated border border-border rounded-lg px-4 py-2.5",
            "text-foreground placeholder:text-foreground-subtle",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500",
            "transition-all duration-200",
            icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };


