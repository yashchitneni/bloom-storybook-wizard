
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  id?: string;
}

const Card = ({ children, className, hoverEffect = false, id }: CardProps) => {
  return (
    <motion.div
      id={id}
      className={cn(
        "bg-white rounded-2xl shadow-md p-6",
        hoverEffect && "transition-all duration-300 hover:-translate-y-2",
        className
      )}
      whileHover={
        hoverEffect
          ? {
              boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.3)",
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
};

export default Card;
