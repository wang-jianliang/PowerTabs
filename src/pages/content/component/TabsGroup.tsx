import { Box, Button, Collapse, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import ScaleBox from '@pages/content/ui/ScaleBox';
import { TabButton } from '@pages/content/component/TabButton';
import { browser } from 'webextension-polyfill-ts';
import React from 'react';
import { useStorage } from '@plasmohq/storage/hook';
import { STORAGE_KEY_SETTINGS } from '@root/utils/reload/constant';

function TabsGroup({
  name,
  groupKey,
  tabs,
  layout = 'vertical',
}: {
  name: string;
  groupKey: string;
  tabs: browser.tabs.Tab[];
  layout: 'vertical' | 'horizontal';
}) {
  const [tabsCollapsed, setTabsCollapsed] = useStorage(`tabsCollapsed-${groupKey}`, false);
  const [settings] = useStorage(STORAGE_KEY_SETTINGS);
  return (
    <Stack>
      <Button
        colorScheme={settings?.colorScheme}
        variant="solid"
        size="sm"
        onClick={() => setTabsCollapsed(!tabsCollapsed)}>
        {name}
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
