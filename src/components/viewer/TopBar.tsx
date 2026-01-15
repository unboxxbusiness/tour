"use client";

interface TopBarProps {
  brandName: string;
  sceneTitle: string;
}

export default function TopBar({ brandName, sceneTitle }: TopBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white drop-shadow-md">
          {brandName}
        </h1>
        <h2 className="text-lg text-white/90 drop-shadow-md">{sceneTitle}</h2>
      </div>
    </div>
  );
}
