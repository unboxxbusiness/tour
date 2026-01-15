"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { tourConfig, Hotspot as HotspotType, InfoSpot as InfoSpotType } from "@/lib/tourConfig";
import type { Pannellum as PannellumType } from "pannellum-react";
import InfoModal, { InfoModalProps } from "../InfoModal";
import Controls from "./Controls";
import TopBar from "./TopBar";
import ScenePanel from "./ScenePanel";
import { Grid3x3, MapPin, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

const Pannellum = dynamic(() => import("pannellum-react").then(mod => mod.Pannellum), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-900 grid place-content-center text-white">Loading 360° Viewer...</div>,
});

const preloadedImages = new Set<string>();

export const prefetchImage = (src: string) => {
  if (!src || preloadedImages.has(src)) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
  preloadedImages.add(src);
};

export default function TourViewer() {
  const [currentSceneId, setCurrentSceneId] = useState(tourConfig.scenes[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewerConfig, setViewerConfig] = useState<any | null>(null);
  const [modalInfo, setModalInfo] = useState<Omit<InfoModalProps, 'isOpen' | 'onClose'> | null>(null);
  const [isScenePanelOpen, setIsScenePanelOpen] = useState(true);
  
  const pannellumRef = useRef<PannellumType>(null);
  const lastHfov = useRef<number | null>(null);

  const switchScene = useCallback((sceneId: string) => {
    if (isTransitioning || sceneId === currentSceneId) return;
    
    setIsTransitioning(true);
    if (pannellumRef.current) {
        const viewer = (pannellumRef.current as any).getViewer();
        lastHfov.current = viewer.getHfov();
        viewer.stopAutoRotate();
    }
    
    setTimeout(() => {
        setCurrentSceneId(sceneId);
    }, 500);
  }, [isTransitioning, currentSceneId]);

  const currentScene = useMemo(() => {
    return tourConfig.scenes.find((s) => s.id === currentSceneId) || tourConfig.scenes[0];
  }, [currentSceneId]);
  
  const handleHotspotClick = useCallback((hotSpotDiv: HTMLElement, args: { sceneId: string }) => {
    switchScene(args.sceneId);
  }, [switchScene]);

  const handleInfoSpotClick = useCallback((hotSpotDiv: HTMLElement, args: InfoSpotType) => {
    setModalInfo({
        title: args.title,
        description: args.description,
        image: args.image,
    });
  }, []);

  const createHotspot = useCallback((spot: HotspotType) => ({
    pitch: spot.pitch,
    yaw: spot.yaw,
    type: "scene",
    sceneId: spot.targetSceneId,
    clickHandlerFunc: handleHotspotClick,
    clickHandlerArgs: { sceneId: spot.targetSceneId },
    cssClass: 'pnlm-hotspot-custom',
    createTooltipFunc: (hotSpotDiv: HTMLElement) => {
        const targetScene = tourConfig.scenes.find(s => s.id === spot.targetSceneId);
        if (targetScene) {
            hotSpotDiv.addEventListener('mouseenter', () => prefetchImage(targetScene.src));
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'pnlm-tooltip';
        
        const innerSpan = document.createElement('span');
        innerSpan.innerText = spot.label;
        tooltip.appendChild(innerSpan);
        
        hotSpotDiv.appendChild(tooltip);
    }
  }), [handleHotspotClick]);

  const createInfoSpot = useCallback((spot: InfoSpotType) => ({
    pitch: spot.pitch,
    yaw: spot.yaw,
    type: 'custom',
    text: spot.title,
    clickHandlerFunc: handleInfoSpotClick,
    clickHandlerArgs: spot,
    cssClass: 'pnlm-hotspot-info',
    createTooltipFunc: (hotSpotDiv: HTMLElement) => {
        if(spot.image) {
            hotSpotDiv.addEventListener('mouseenter', () => prefetchImage(spot.image));
        }
    }
  }), [handleInfoSpotClick]);

  useEffect(() => {
    const hotspots = currentScene.hotspots.map(createHotspot);
    const infoSpots = (currentScene.infoSpots || []).map(createInfoSpot);

    const sceneConfig: any = {
      ...currentScene,
      imageSource: currentScene.src,
      autoLoad: true,
      showControls: false,
      hfov: lastHfov.current || 100,
      pitch: currentScene.initialPitch,
      yaw: currentScene.initialYaw,
      sceneFadeDuration: 500,
      hotSpots: [...hotspots, ...infoSpots],
    };
    
    setViewerConfig(sceneConfig);
    setTimeout(() => setIsTransitioning(false), 500);

  }, [currentScene, createHotspot, createInfoSpot]);

  if (!viewerConfig) {
    return <div className="h-full w-full bg-gray-900 grid place-content-center text-white">Loading Scene...</div>;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
        <TopBar />
        
        <ScenePanel
          scenes={tourConfig.scenes}
          currentSceneId={currentSceneId}
          onSceneSelect={switchScene}
          isOpen={isScenePanelOpen}
        />
        
        <div className={`h-full w-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <Pannellum
            ref={pannellumRef}
            width="100%"
            height="100%"
            key={currentSceneId}
            {...viewerConfig}
            image={viewerConfig.imageSource}
            onLoad={() => {
                setIsTransitioning(false);
            }}
            >
            </Pannellum>
        </div>
        
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex items-center gap-2 rounded-lg bg-gray-900/50 p-1 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsScenePanelOpen(prev => !prev)}
              aria-label="Toggle Scene List"
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Grid3x3 className="h-5 w-5" />
            </Button>
             <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Map"
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <MapPin className="h-5 w-5" />
            </Button>
             <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Gallery"
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

      {modalInfo && (
          <InfoModal 
            isOpen={!!modalInfo}
            onClose={() => setModalInfo(null)}
            {...modalInfo}
          />
      )}
    </div>
  );
}
