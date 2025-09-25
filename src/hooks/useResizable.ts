"use client";

import { useCallback, useEffect, useState } from "react";

interface UseResizableOptions {
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
}

export const useResizable = ({
  minWidth,
  maxWidth,
  defaultWidth,
}: UseResizableOptions) => {
  const [width, setWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Load from localStorage immediately after hydration
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-width");
    if (saved) {
      const savedWidth = parseInt(saved, 10);
      if (savedWidth >= minWidth && savedWidth <= maxWidth) {
        setWidth(savedWidth);
        return;
      }
    }
    setWidth(defaultWidth);
  }, [minWidth, maxWidth, defaultWidth]);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && width !== null) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth);
          localStorage.setItem("sidebar-width", newWidth.toString());
        }
      }
    },
    [isResizing, minWidth, maxWidth, width],
  );

  useEffect(() => {
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return {
    width,
    isResizing,
    startResizing,
  };
};
