"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { tourConfig, Hotspot as HotspotType, InfoSpot as InfoSpotType } from "@/lib/tourConfig";
import type { Pannellum as PannellumType } from "pannellum-react";
import InfoModal, { InfoModalProps } from "../InfoModal";
import Controls from "./Controls";
import TopBar from "./TopBar";

// Dynamically import Pannellum to ensure it's only client-side
const Pannellum = dynamic(() => import("pannellum-react").then(mod => mod.Pannellum), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-900 grid place-content-center text-white">Loading 360° Viewer...</div>,
});

const preloadedImages = new Set<string>();

const prefetchImage = (src: string) => {
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
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  
  const pannellumRef = useRef<PannellumType>(null);
  const lastHfov = useRef<number | null>(null);

  const switchScene = useCallback((sceneId: string) => {
    if (isTransitioning || sceneId === currentSceneId) return;
    
    setIsTransitioning(true);
    if (pannellumRef.current) {
        lastHfov.current = pannellumRef.current.getHfov();
        pannellumRef.current.stopAutoRotate();
        setIsAutoRotating(false);
    }
    
    // Fade out
    setTimeout(() => {
        setCurrentSceneId(sceneId);
        // Fade in will be handled by the useEffect that watches currentSceneId
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
    text: spot.label,
    sceneId: spot.targetSceneId,
    clickHandlerFunc: handleHotspotClick,
    clickHandlerArgs: { sceneId: spot.targetSceneId },
    cssClass: 'pnlm-hotspot-custom',
    createTooltipFunc: (hotSpotDiv: HTMLElement) => {
        const targetScene = tourConfig.scenes.find(s => s.id === spot.targetSceneId);
        if (targetScene) {
            hotSpotDiv.addEventListener('mouseenter', () => prefetchImage(targetScene.src));
        }
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

  useMemo(() => {
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
    // After config is set, allow transitions again
    setTimeout(() => setIsTransitioning(false), 500);

  }, [currentScene, createHotspot, createInfoSpot]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!pannellumRef.current) return;
    const currentHfov = pannellumRef.current.getHfov();
    const newHfov = direction === 'in' ? currentHfov - 10 : currentHfov + 10;
    pannellumRef.current.setHfov(newHfov);
  };

  const handleReset = () => {
    if (!pannellumRef.current) return;
    pannellumRef.current.setPitch(currentScene.initialPitch);
    pannellumRef.current.setYaw(currentScene.initialYaw);
    pannellumRef.current.setHfov(100);
  };

  const handleToggleFullscreen = () => {
    if (!pannellumRef.current) return;
    pannellumRef.current.toggleFullscreen();
  };

  const handleToggleAutoRotate = () => {
    if (!pannellumRef.current) return;
    if (isAutoRotating) {
      pannellumRef.current.stopAutoRotate();
    } else {
      pannellumRef.current.startAutoRotate(-2);
    }
    setIsAutoRotating(!isAutoRotating);
  };

  if (!viewerConfig) {
    return <div className="h-full w-full bg-gray-900 grid place-content-center text-white">Loading Scene...</div>;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
        <TopBar brandName="Virtual Tour" sceneTitle={currentScene.title} />
        <div className={`h-full w-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <Pannellum
            ref={pannellumRef}
            width="100%"
            height="100%"
            key={currentSceneId} // Force re-render on scene change
            {...viewerConfig}
            image={viewerConfig.imageSource} // Pass image prop directly as per pannellum-react docs
            onLoad={() => {
                // Scene is loaded, start fade in
                setIsTransitioning(false);
            }}
            >
            </Pannellum>
        </div>
        <Controls
            onZoomIn={() => handleZoom('in')}
            onZoomOut={() => handleZoom('out')}
            onReset={handleReset}
            onToggleFullscreen={handleToggleFullscreen}
            onToggleAutoRotate={handleToggleAutoRotate}
            isAutoRotating={isAutoRotating}
        />
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
