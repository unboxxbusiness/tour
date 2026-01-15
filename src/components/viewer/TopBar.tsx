"use client";

import { ReactNode } from "react";

interface TopBarProps {
  brandName: string;
  sceneTitle: string;
  children?: ReactNode;
}

export default function TopBar({ brandName, sceneTitle, children }: TopBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white drop-shadow-md hidden sm:block">
            {brandName}
            </h1>
            {children}
        </div>
        <h2 className="text-lg text-white/90 drop-shadow-md">{sceneTitle}</h2>
      </div>
    </div>
  );
}
