"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings } from "lucide-react";
import { Button } from "../ui/button";

const navLinks = [
  "Campus Zones",
  "Leadership",
  "Learning Areas",
  "Labs",
  "Landmarks",
  "Hostels",
  "Sports",
];

export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-[#003c8a]">
      <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Image
            src="/srm-logo.png"
            alt="SRM Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <DropdownMenu key={link}>
              <DropdownMenuTrigger className="flex items-center gap-1 text-white font-medium hover:text-yellow-300 transition-colors focus:outline-none focus:text-yellow-300">
                {link} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Coming Soon</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                <Settings />
            </Button>
        </div>
      </div>
    </div>
  );
}
