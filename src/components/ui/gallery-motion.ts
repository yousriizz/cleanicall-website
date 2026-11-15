export const galleryMotionProfiles = {
  studio: { duration: 600, frameInset: .028, desktopTravel: 24, mobileTravel: 12, captionTravel: 6 },
  signature: { duration: 550, frameInset: .018, desktopTravel: 16, mobileTravel: 8, captionTravel: 4 },
} as const;

export type GalleryMotionProfile = (typeof galleryMotionProfiles)[keyof typeof galleryMotionProfiles];

export const galleryMotionLayers = {
  imageScale: .04,
  restingImageZoom: .04,
  imageFade: .1,
  captionFade: .05,
  hoverTitleTravel: 8,
  hoverDuration: 240,
};
