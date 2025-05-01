
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const Card = ({ children, className, hoverEffect = false }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-card p-6",
        hoverEffect && "hover-lift",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
