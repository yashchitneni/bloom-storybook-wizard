import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
  className
}: ButtonProps) => {
  const variants = {
    primary: "bg-goldenYellow text-white hover:bg-opacity-90",
    secondary: "bg-mintGreen text-darkText hover:bg-opacity-90",
    outline: "bg-transparent border border-goldenYellow text-goldenYellow hover:bg-goldenYellow/5"
  };
  const sizes = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-6 text-base",
    lg: "py-3 px-8 text-lg"
  };
  return <motion.button type={type} onClick={onClick} disabled={disabled} whileHover={!disabled ? {
    scale: 1.05,
    boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)"
  } : {}} whileTap={!disabled ? {
    scale: 0.98
  } : {}} className="">
      
      {withArrow && <ArrowRight className={cn("ml-2 h-4 w-4")} />}
    </motion.button>;
};
export default Button;