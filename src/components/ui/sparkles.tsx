
"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SparklesProps {
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleColor?: string;
  particleDensity?: number;
}

export const SparklesCore = ({
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleColor = "#FFF",
  particleDensity = 1000,
}: SparklesProps) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);

  const resizeCanvas = () => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (canvasSize.width !== width || canvasSize.height !== height) {
        setCanvasSize({ width, height });
      }
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }

    const generateCircles = () => {
      const newCircles = [];
      for (let i = 0; i < particleDensity; i++) {
        const x = Math.random() * canvasSize.width;
        const y = Math.random() * canvasSize.height;
        const size = Math.random() * (maxSize - minSize) + minSize;
        const opacity = Math.random();
        const speedX = (Math.random() - 0.5) * 0.2;
        const speedY = (Math.random() - 0.5) * 0.2;
        newCircles.push({ x, y, size, opacity, speedX, speedY });
      }
      circles.current = newCircles;
    };

    if (context.current && canvasSize.width > 0 && canvasSize.height > 0) {
      generateCircles();
      const animate = () => {
        if (context.current && canvasRef.current) {
          context.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          circles.current.forEach((circle) => {
            context.current!.beginPath();
            context.current!.arc(
              circle.x,
              circle.y,
              circle.size,
              0,
              2 * Math.PI
            );
            context.current!.fillStyle = `${particleColor}${Math.floor(
              circle.opacity * 255
            ).toString(16)}`;
            context.current!.fill();

            // Update position for next frame
            circle.x += circle.speedX;
            circle.y += circle.speedY;

            // Wrap around edges
            if (circle.x < 0) circle.x = canvasSize.width;
            if (circle.x > canvasSize.width) circle.x = 0;
            if (circle.y < 0) circle.y = canvasSize.height;
            if (circle.y > canvasSize.height) circle.y = 0;
          });
        }
        requestAnimationFrame(animate);
      };

      const animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [canvasSize, particleColor, particleDensity, minSize, maxSize]);

  return (
    <div
      className={cn("h-full w-full", className)}
      ref={containerRef}
      style={{
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: background,
        }}
      />
    </div>
  );
};

