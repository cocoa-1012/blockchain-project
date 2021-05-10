export enum VideoAssetQuality {
  Preview = 'preview',
  Max = '',
}

export interface VideoAssetOptions {
  quality?: VideoAssetQuality;
}
