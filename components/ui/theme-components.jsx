"use client";

import { cn } from "@/lib/utils";

// 🎨 Pre-styled components that auto-update with theme
export function ThemeButton({
  variant = "primary",
  children,
  className,
  ...props
}) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
  };

  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ThemeCard({ hover = false, children, className, ...props }) {
  return (
    <div
      className={cn("card-theme", hover && "card-hover", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ThemeHeading({ level = 1, children, className, ...props }) {
  const Component = `h${level}`;
  return (
    <Component
      className={cn("font-heading text-gradient", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function ThemeText({ children, className, ...props }) {
  return (
    <p className={cn("font-body", className)} {...props}>
      {children}
    </p>
  );
}
