import { Box, Button, Image } from '@chakra-ui/react';
import React from 'react';
import { browser } from 'webextension-polyfill-ts';

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
  };
}) {
  return (
    <Button
      textAlign="left"
      maxW="100%"
      width="100%"
      p={2}
      size="s"
      variant="outline"
      bg="white"
      colorScheme="blue"
      onClick={() => switchTab(tab.id, tab.windowId)}
      fontSize="small">
      <Image scale={1} height="1em" marginRight={1} src={tab.favIconUrl}></Image>
      <Box as="span" display="block" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
        {tab.title}
      </Box>
    </Button>
  );
}
