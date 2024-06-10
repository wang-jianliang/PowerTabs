import { Box, Button, Image } from '@chakra-ui/react';
import React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { useStorage } from '@plasmohq/storage/hook';
import { STORAGE_KEY_SETTINGS } from '@root/utils/reload/constant';

const switchTab = (tabId: number, windowId: number) => {
  browser.runtime.sendMessage({
    command: 'active_tab',
    tabId: tabId,
    windowId: windowId,
  });
};

export function TabButton({
  tab,
}: {
  tab: {
    id: number;
    windowId: number;
    favIconUrl: string;
    title: string;
    active: boolean;
  };
}) {
  const [settings] = useStorage(STORAGE_KEY_SETTINGS);
  return (
    <Button
      textAlign="left"
      maxW="100%"
      width="100%"
      p={2}
      size="s"
      variant="outline"
      bg={tab.active && settings ? `${settings.colorScheme}.50` : 'white'}
      height={7}
      colorScheme={settings?.colorScheme}
      onClick={() => switchTab(tab.id, tab.windowId)}
      fontSize="small">
      <Image scale={1} height="1em" marginRight={1} src={tab.favIconUrl}></Image>
      <Box as="span" display="block" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
        {tab.title}
      </Box>
    </Button>
  );
}
