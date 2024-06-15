import { Box, Button, Flex, Image } from '@chakra-ui/react';
import { BiCurrentLocation } from 'react-icons/bi';
import React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { useStorage } from '@plasmohq/storage/hook';
import { DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS } from '@root/utils/reload/constant';
import { CloseIcon } from '@chakra-ui/icons';

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
  const [settings] = useStorage(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
  return (
    <Button
      textAlign="left"
      maxW="100%"
      width="100%"
      p={2}
      size="s"
      variant={settings?.border ? 'outline' : 'ghost'}
      justifyContent="space-between"
      // variant={tab.active ? 'solid' : settings?.border ? 'outline' : 'ghost'}
      bg={tab.active && settings ? `${settings.colorScheme}.50` : 'white'}
      height={7}
      colorScheme={settings?.colorScheme}
      onClick={() => switchTab(tab.id, tab.windowId)}
      fontSize="13px"
      rightIcon={
        <Box
          borderRadius={3}
          marginY={2}
          fontSize="10px"
          _hover={{
            cursor: 'pointer',
            backgroundColor: 'gray.50',
          }}
          padding={1}
          onClick={event => {
            event.stopPropagation();
            browser.runtime.sendMessage({
              command: 'close_tab',
              tabId: tab.id,
              windowId: tab.windowId,
            });
          }}>
          <CloseIcon />
        </Box>
      }>
      {tab.active && <BiCurrentLocation />}
      <Flex width={tab.active ? '88%' : '89%'} justifyContent="center">
        <Image scale={1} height="1em" marginLeft={2} marginRight={1} src={tab.favIconUrl}></Image>
        <Box
          as="span"
          display="block"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          fontWeight={tab.active ? 'bold' : 'normal'}>
          {tab.title}
        </Box>
      </Flex>
    </Button>
  );
}
