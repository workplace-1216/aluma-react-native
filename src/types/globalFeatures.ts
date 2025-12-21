export interface WeeklyTipVideo {
  _id?: string;
  title?: string;
  subtitle?: string;
  url?: string;
  cover_url?: string;
  thumbnail?: string;
}

export interface GlobalFeatures {
  weekly_tip?: string;
  ujjayi_breathe?: string;
  bottom_left_corner_quote?: string;
  weekly_tip_videos?: WeeklyTipVideo[];
}

export type GlobalFeaturesStatus = 'idle' | 'loading' | 'success' | 'error';
