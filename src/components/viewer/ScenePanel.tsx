"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Scene } from "@/lib/tourConfig";
import { cn } from "@/lib/utils";
import { prefetchImage } from "./TourViewer";
import { Sheet, SheetContent } from "../ui/sheet";

interface ScenePanelProps {
  scenes: Scene[];
  currentSceneId: string;
  onSceneSelect: (sceneId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function SceneList({ scenes, currentSceneId, onSceneSelect }: Omit<ScenePanelProps, 'isOpen' | 'onClose'>) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredScenes = scenes.filter((scene) =>
        scene.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full w-full bg-gray-900/80 backdrop-blur-sm text-white flex flex-col">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Scenes</h3>
                <Input
                type="text"
                placeholder="Search scenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                />
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 pt-0 space-y-2">
                {filteredScenes.map((scene) => (
                    <button
                    key={scene.id}
                    onClick={() => onSceneSelect(scene.id)}
                    onMouseEnter={() => prefetchImage(scene.src)}
                    className={cn(
                        "w-full text-left p-2 rounded-md flex items-center gap-3 transition-colors",
                        "hover:bg-white/20",
                        currentSceneId === scene.id ? "bg-white/20" : "bg-white/10"
                    )}
                    >
                    <div className="relative h-10 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                        src={scene.thumb}
                        alt={scene.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <span className="font-medium text-sm truncate">{scene.title}</span>
                    </button>
                ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default function ScenePanel(props: ScenePanelProps) {

  // For Mobile: Use a Sheet component
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return (
        <Sheet open={props.isOpen} onOpenChange={props.onClose}>
            <SheetContent side="left" className="p-0 border-0 w-80 bg-transparent">
                <SceneList {...props} />
            </SheetContent>
        </Sheet>
    )
  }

  // For Desktop: Show a persistent panel
  return (
    <div className="hidden lg:block w-80 h-full flex-shrink-0">
        <SceneList {...props} />
    </div>
  );
}
