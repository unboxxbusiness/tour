"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";

export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image?: string;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  description,
  image,
}: InfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-2">{description}</DialogDescription>
        </DialogHeader>
        {image && (
          <div className="relative h-60 w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-md object-cover"
            />
          </div>
        )}
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="mt-4">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
