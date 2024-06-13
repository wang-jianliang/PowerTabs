import React from 'react';
import { Box, Button, Collapse, Image, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import ScaleBox from '@pages/content/ui/ScaleBox';
import { TabButton } from '@pages/content/component/TabButton';
import { useStorage } from '@plasmohq/storage/hook';
import { DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS } from '@root/utils/reload/constant';

function TabsGroup({
  name,
  groupKey,
  tabs,
  layout = 'vertical',
  iconUrl,
}: {
  name: string;
  groupKey: string;
  iconUrl?: string | undefined;
  tabs: {
    id: number;
    windowId: number;
    favIconUrl: string;
    title: string;
    active: boolean;
  }[];
  layout: 'vertical' | 'horizontal';
}) {
  const [tabsCollapsed, setTabsCollapsed] = useStorage(`tabsCollapsed-${groupKey}`, false);
  const [settings] = useStorage(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
  return (
    <Stack>
      <Button
        colorScheme={settings?.colorScheme}
        variant={settings?.border ? 'solid' : 'outline'}
        size="sm"
        onClick={() => setTabsCollapsed(!tabsCollapsed)}>
        <Image scale={1} height="1em" marginLeft={2} marginRight={1} src={iconUrl}></Image>
        {name} ({tabs.length}) {tabsCollapsed ? '▼' : '▲'}
      </Button>
      <Collapse in={!tabsCollapsed} animateOpacity>
        <Wrap height="100%">
          {tabs.map((tab, index) => (
            <WrapItem key={index}>
              <Box paddingX={4}>
                <ScaleBox>
                  <Box width={layout === 'vertical' ? '35ch' : 'max-content'}>
                    <TabButton key={tab.id} tab={tab} />
                  </Box>
                </ScaleBox>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Collapse>
    </Stack>
  );
}

export default TabsGroup;
