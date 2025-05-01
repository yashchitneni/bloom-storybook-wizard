
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  withArrow?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  onClick,
  type = "button",
  disabled = false,
  className,
}: ButtonProps) => {
  const variants = {
    primary: "bg-persimmon text-white hover:bg-opacity-90",
    secondary: "bg-sunshine text-darkText hover:bg-opacity-90",
    outline: "bg-transparent border border-persimmon text-persimmon hover:bg-persimmon/5",
  };

  const sizes = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-6 text-base",
    lg: "py-3 px-8 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-poppins font-bold inline-flex items-center justify-center rounded-999 transition-all duration-200 shadow-card",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowRight className={cn("ml-2 h-4 w-4", withArrow && "group-hover:animate-arrow-wiggle")} />
      )}
    </button>
  );
};

export default Button;
