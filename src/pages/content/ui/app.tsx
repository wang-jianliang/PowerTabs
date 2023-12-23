import React, { useState , useEffect } from 'react';
import { Box, Collapse, Image, StackDivider, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { browser } from 'webextension-polyfill-ts';
import ScaleButton from './ScaleButton';

function App() {
  const [show, setShow] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [groupedTabs, setGroupedTabs] = useState({});
  const [groupField] = useState('windowId');

  const groupTabs = (tabs, field: string) => {
    return tabs.reduce((acc, obj: object) => {
      const key = obj[field] != null ? String(obj[field]) : '__undefined__';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (tabs.length > 0) {
      const ts = groupTabs(tabs, groupField);
      console.log('grouped tabs:', ts);
      setGroupedTabs(ts);
    }
  }, [tabs, groupField]);

  useEffect(() => {
    if (show) {
      browser.runtime.sendMessage({ command: 'get_tabs' }).then(response => {
        console.log(response);
        setTabs(response.tabs);
      });
    }
  }, [show]);

  const handleMouseOver = () => {
    setShow(true);
  };

  const handleMouseOut = () => {
    console.log('mouse out');
    setShow(false);
  };

  const switchTab = (tabId: number, windowId: number) => {
    browser.runtime.sendMessage({
      command: 'active_tab',
      tabId: tabId,
      windowId: windowId,
    });
  };

  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 5 && e.clientX <= 200) {
      // 阈值可以自行设定
      console.log('The mouse has left the browser window from the top.');
      setShow(true);
    }
  });

  return (
    <Collapse in={show}>
      <Box
        backgroundColor="gray.50"
        position="fixed"
        top="0"
        bg="Gray.50"
        width="100vw"
        maxHeight="50vh"
        zIndex="10000"
        overflowY="auto"
        padding={3}
        rounded="md"
        shadow="md"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}>
        <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
          {Object.keys(groupedTabs).map((key, keyIndex) => (
            <Wrap height="100%" key={keyIndex}>
              {groupedTabs[key].map((tab, index) => (
                <WrapItem key={index}>
                  <ScaleButton
                    textAlign="left"
                    maxW="25ch"
                    p={2}
                    size="xs"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => switchTab(tab.id, tab.windowId)}
                    fontSize="x-small">
                    <Image scale={1} height="1em" marginRight={1} src={tab.favIconUrl}></Image>
                    <Box as="span" display="block" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                      {tab.title}
                    </Box>
                  </ScaleButton>
                </WrapItem>
              ))}
            </Wrap>
          ))}
        </VStack>
      </Box>
    </Collapse>
  );
}

export default App;
