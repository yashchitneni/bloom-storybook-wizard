import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { ArrowRight } from "lucide-react";
const TransformVisual: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return;
};
export default TransformVisual;