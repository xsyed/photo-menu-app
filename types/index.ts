export interface Photo {
  id: string;
  fileName: string;
  uri: string;
  timestamp: number;
  width: number;
  height: number;
}

export type ViewMode = 'grid' | 'list';

export interface PhotoStore {
  photos: Photo[];
  viewMode: ViewMode;
}

export const STORAGE_KEYS = {
  PHOTOS: '@photomenu:photos',
  VIEW_MODE: '@photomenu:viewMode',
} as const;
