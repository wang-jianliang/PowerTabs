import { Settings } from '@src/types';

export const LOCAL_RELOAD_SOCKET_PORT = 8081;
export const LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;

export const STORAGE_KEY_SETTINGS = 'settings';

export const DEFAULT_SETTINGS: Settings = {
  position: 'left',
  pinned: false,
  colorScheme: 'teal',
  border: true,
};
