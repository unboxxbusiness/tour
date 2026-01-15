"use client";

import Image from "next/image";
import { Scene } from "@/lib/tourConfig";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface MinimapProps {
  floorplanSrc: string;
  scenes: Scene[];
  currentSceneId: string;
  onSceneSelect: (sceneId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Minimap({
  floorplanSrc,
  scenes,
  currentSceneId,
  onSceneSelect,
  isOpen,
  onClose,
}: MinimapProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-4 right-4 z-20 w-64 h-48 md:w-80 md:h-60 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 shadow-lg flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-gray-800/50">
        <h4 className="font-semibold text-white text-sm">Floor Plan</h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 text-white hover:bg-white/20 hover:text-white"
          aria-label="Close minimap"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative flex-1">
        <Image
          src={floorplanSrc}
          alt="Floor plan"
          fill
          className="object-contain"
        />
        {scenes.map((scene) => {
          if (!scene.sceneMapPosition) return null;

          return (
            <button
              key={`map-marker-${scene.id}`}
              title={scene.title}
              onClick={() => onSceneSelect(scene.id)}
              className={cn(
                "absolute w-4 h-4 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white",
                currentSceneId === scene.id
                  ? "bg-blue-500 border-white scale-125 z-10"
                  : "bg-gray-300 border-gray-700 hover:scale-110 hover:bg-blue-400"
              )}
              style={{
                left: `${scene.sceneMapPosition.x}%`,
                top: `${scene.sceneMapPosition.y}%`,
              }}
              aria-label={`Go to ${scene.title}`}
            />
          );
        })}
      </div>
    </div>
  );
}
