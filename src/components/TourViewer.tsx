"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { tourConfig, Scene, Hotspot as HotspotType, InfoSpot as InfoSpotType } from "@/lib/tourConfig";

// Dynamically import Pannellum to ensure it's only client-side
const Pannellum = dynamic(() => import("pannellum-react"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-900 grid place-content-center text-white">Loading 360° Viewer...</div>,
});

export default function TourViewer() {
  const [currentSceneId, setCurrentSceneId] = useState(tourConfig.scenes[0].id);

  const currentScene = useMemo(() => {
    return tourConfig.scenes.find((s) => s.id === currentSceneId) || tourConfig.scenes[0];
  }, [currentSceneId]);
  
  const handleHotspotClick = useCallback((hotSpotDiv: HTMLElement, args: { sceneId: string }) => {
    setCurrentSceneId(args.sceneId);
  }, []);

  const sceneConfig = useMemo(() => {
    const config: any = {
      ...currentScene,
      imageSource: currentScene.src,
      autoLoad: true,
      showControls: false,
      hotSpots: currentScene.hotspots.map((spot: HotspotType) => ({
        pitch: spot.pitch,
        yaw: spot.yaw,
        type: "scene",
        text: spot.label,
        sceneId: spot.targetSceneId,
        clickHandlerFunc: handleHotspotClick,
        clickHandlerArgs: { sceneId: spot.targetSceneId }
      })),
    };

    if (currentScene.infoSpots) {
        currentScene.infoSpots.forEach((spot: InfoSpotType) => {
            config.hotSpots.push({
                pitch: spot.pitch,
                yaw: spot.yaw,
                type: 'info',
                text: spot.title,
                URL: spot.image ? spot.image : undefined
            });
        });
    }

    return config;
  }, [currentScene, handleHotspotClick]);

  if (!currentScene) {
    return <div className="h-full w-full bg-gray-900 grid place-content-center text-white">Scene not found.</div>;
  }

  return (
    <div className="h-full w-full">
      <Pannellum
        width="100%"
        height="100%"
        // The key is essential to force a re-render when the scene changes
        key={currentSceneId}
        pitch={currentScene.initialPitch}
        yaw={currentScene.initialYaw}
        image={sceneConfig.imageSource}
        hotSpots={sceneConfig.hotSpots}
        onMousedown={(e:any) => console.log('viewer event', e)}
      >
      </Pannellum>
    </div>
  );
}
