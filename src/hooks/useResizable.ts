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
	const [width, setWidth] = useState(defaultWidth);
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
