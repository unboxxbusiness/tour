"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, ChevronDown, Settings } from "lucide-react";
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
        <div className="flex items-center gap-2 text-white">
          <Building2 className="h-8 w-8" />
          <span className="text-xl font-bold">SRM Virtual Tour</span>
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
