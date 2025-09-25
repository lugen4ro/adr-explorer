"use client";

import { useCallback, useEffect, useState } from "react";

interface UseResizableOptions {
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
}

export const useResizable = ({ minWidth, maxWidth, defaultWidth }: UseResizableOptions) => {
  const [width, setWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-width");
      if (saved) {
        const savedWidth = parseInt(saved, 10);
        if (savedWidth >= minWidth && savedWidth <= maxWidth) {
          return savedWidth;
        }
      }
    }
    return defaultWidth;
  });
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth);
          if (typeof window !== "undefined") {
            localStorage.setItem("sidebar-width", newWidth.toString());
          }
        }
      }
    },
    [isResizing, minWidth, maxWidth],
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
