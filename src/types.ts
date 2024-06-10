export type Position = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'top' | 'bottom';

export interface Settings {
  position?: Position;
  pinned?: boolean;
  colorScheme?: string;
}
