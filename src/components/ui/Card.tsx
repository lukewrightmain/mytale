import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: "primary" | "accent" | "success" | "none";
}

export function Card({
  className,
  hover = false,
  glow = "none",
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    primary: "hover:shadow-primary-500/20",
    accent: "hover:shadow-accent-500/20",
    success: "hover:shadow-secondary-500/20",
    none: "",
  };

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border overflow-hidden",
        hover && "card-hover cursor-pointer hover:border-stone-700",
        glow !== "none" && glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4 border-b border-border", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-4 border-t border-border bg-surface-elevated", className)}
      {...props}
    >
      {children}
    </div>
  );
}


