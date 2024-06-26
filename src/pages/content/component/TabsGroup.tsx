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
  console.log(tabs);
  return (
    <Stack alignItems="center">
      <Button
        colorScheme={settings?.colorScheme}
        variant={settings?.border ? 'solid' : 'outline'}
        size="sm"
        fontSize="14px"
        height="32px"
        width="332px"
        onClick={() => setTabsCollapsed(!tabsCollapsed)}>
        <Image scale={1} height="1em" marginLeft={2} marginRight={1} src={iconUrl}></Image>
        {name} ({tabs.length}) {tabsCollapsed ? '▼' : '▲'}
      </Button>
      <Collapse in={!tabsCollapsed} animateOpacity style={{ overflow: 'visible' }}>
        <Wrap height="100%" justify="center">
          {tabs
            .sort((a, b) => b.id - a.id)
            .map((tab, index) => (
              <WrapItem key={index}>
                <Box paddingX={4} zIndex={10001} position="relative">
                  <ScaleBox>
                    <Box width={layout === 'vertical' ? '314px' : 'max-content'}>
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
