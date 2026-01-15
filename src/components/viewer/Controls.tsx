"use client";

import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Play,
  Pause,
} from "lucide-react";

interface ControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
  onToggleAutoRotate: () => void;
  isAutoRotating: boolean;
}

export default function Controls({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen,
  onToggleAutoRotate,
  isAutoRotating,
}: ControlsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 rounded-lg bg-gray-900/50 p-2 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          aria-label="Zoom In"
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <ZoomIn className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          aria-label="Zoom Out"
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <ZoomOut className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          aria-label="Reset View"
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAutoRotate}
          aria-label={isAutoRotating ? "Pause Auto-rotate" : "Start Auto-rotate"}
          className="text-white hover:bg-white/20 hover:text-white"
        >
          {isAutoRotating ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          aria-label="Toggle Fullscreen"
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <Maximize className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
