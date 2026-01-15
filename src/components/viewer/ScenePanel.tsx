"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scene } from "@/lib/tourConfig";
import { cn } from "@/lib/utils";
import { prefetchImage } from "@/components/viewer/TourViewer";

interface ScenePanelProps {
  scenes: Scene[];
  currentSceneId: string;
  onSceneSelect: (sceneId: string) => void;
  isOpen: boolean;
}

export default function ScenePanel({ scenes, currentSceneId, onSceneSelect, isOpen }: ScenePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-48">
       <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              onMouseEnter={() => prefetchImage(scene.src)}
              className={cn(
                "w-full text-center p-2 rounded-md flex flex-col items-center gap-2 transition-all",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900/50 focus:ring-white"
              )}
            >
              <div className={cn(
                  "relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-4 transition-all",
                  currentSceneId === scene.id ? "border-yellow-400" : "border-white/50 hover:border-white"
              )}>
                <Image
                  src={scene.thumb}
                  alt={scene.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <span className={cn(
                  "font-semibold text-sm drop-shadow-md",
                  index === 0 ? "text-yellow-400" : "text-white"
              )}>
                  {scene.title}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
