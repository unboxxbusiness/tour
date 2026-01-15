import { z } from 'zod';
import tourData from '../../public/tour/tourConfig.json';

const HotspotSchema = z.object({
  id: z.string(),
  pitch: z.number(),
  yaw: z.number(),
  targetSceneId: z.string(),
  label: z.string(),
});

const InfoSpotSchema = z.object({
  id: z.string(),
  pitch: z.number(),
  yaw: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
});

const SceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  src: z.string(),
  thumb: z.string(),
  initialYaw: z.number(),
  initialPitch: z.number(),
  hotspots: z.array(HotspotSchema),
  infoSpots: z.array(InfoSpotSchema).optional(),
});

const TourConfigSchema = z.object({
  scenes: z.array(SceneSchema),
});

export type Hotspot = z.infer<typeof HotspotSchema>;
export type InfoSpot = z.infer<typeof InfoSpotSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type TourConfig = z.infer<typeof TourConfigSchema>;

let validatedConfig: TourConfig;

try {
  validatedConfig = TourConfigSchema.parse(tourData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Invalid tour configuration:', error.issues);
    throw new Error('Tour configuration validation failed. Check the console for details.');
  }
  console.error('An unexpected error occurred while loading tour configuration:', error);
  throw new Error('Failed to load tour configuration.');
}

export const tourConfig: TourConfig = validatedConfig;
