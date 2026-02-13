import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground shadow-sm",
        outline: "border border-input bg-background text-foreground hover:bg-muted/50",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20",
        warning:
          "border-transparent bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/20",
        info:
          "border-transparent bg-blue-500/15 text-blue-700 ring-1 ring-blue-500/20",
        purple:
          "border-transparent bg-violet-500/15 text-violet-700 ring-1 ring-violet-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
