import React, { useEffect, useRef } from 'react';

interface ResourceUsageBarProps {
    actual: number;      // Actual usage (e.g., current CPU/memory usage)
    requested: number;   // Requested resources
    capacity: number;    // Total capacity/limit
    height?: number;     // Height of the bar
    showPercentages?: boolean; // Whether to show percentage labels
}

export const ResourceUsageBar: React.FC<ResourceUsageBarProps> = ({
    actual,
    requested,
    capacity,
    height = 20,
    showPercentages = true
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lineExtension = 5; // How much the line extends above/below
    const totalHeight = height + (lineExtension * 2);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size (accounting for device pixel ratio)
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Calculate percentages
        const actualPercent = Math.min((actual / capacity) * 100, 100);
        const requestedPercent = Math.min((requested / capacity) * 100, 100);

        // Draw background (total capacity) - dark gray
        ctx.fillStyle = '#27272a'; // zinc-800
        ctx.fillRect(0, lineExtension, rect.width, height);

        // Draw actual usage - lighter gray
        const actualWidth = (actualPercent / 100) * rect.width;
        ctx.fillStyle = '#71717a'; // zinc-500
        ctx.fillRect(0, lineExtension, actualWidth, height);

        // Draw requested line - white
        const requestedX = (requestedPercent / 100) * rect.width;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(requestedX, 0);
        ctx.lineTo(requestedX, totalHeight);
        ctx.stroke();

        // Draw percentage labels if enabled
        if (showPercentages) {
            ctx.font = '11px monospace';
            ctx.fillStyle = '#ffffff';
            
            // Actual usage label
            const actualText = `${actualPercent.toFixed(1)}%`;
            const actualTextWidth = ctx.measureText(actualText).width;
            const actualTextX = Math.min(actualWidth + 5, rect.width - actualTextWidth - 5);
            ctx.fillText(actualText, actualTextX, lineExtension + height / 2 + 4);

            // Removed requested label to keep the visualization cleaner
        }

    }, [actual, requested, capacity, height, showPercentages, lineExtension, totalHeight]);

    return (
        <div className="w-full">
            <canvas
                ref={canvasRef}
                className="w-full"
                style={{ height: `${totalHeight}px` }}
            />
            {showPercentages && (
                <div className="flex justify-between mt-1 text-xs text-zinc-500">
                    <span>0%</span>
                    <span>100%</span>
                </div>
            )}
        </div>
    );
};