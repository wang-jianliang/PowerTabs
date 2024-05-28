import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';
import { Position } from '@src/types';

interface Settings {
  position: string;
}

type SettingsStorage = BaseStorage<Settings> & {
  setPosition: (position: Position) => void;
};

const storage = createStorage<Settings>(
  'settings-storage-key',
  { position: 'left' },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

const settingsStorage: SettingsStorage = {
  ...storage,
  setPosition: position => {
    storage.set({ position });
  },
};

export default settingsStorage;
