import React, { useState, useEffect, use } from 'react';
import { Box, Center, Collapse, Image, StackDivider, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { browser } from 'webextension-polyfill-ts';
import ScaleButton from './ScaleButton';

function shouldShowTabs(position, x, y) {
  if (position === 'topLeft') {
    return y <= 5 && x <= 200;
  } else if (position === 'topRight') {
    return y <= 5 && x >= window.innerWidth - 200;
  } else if (position === 'bottomLeft') {
    return y >= window.innerHeight - 5 && x <= 200;
  } else if (position === 'bottomRight') {
    return y >= window.innerHeight - 5 && x >= window.innerWidth - 200;
  }
  return false;
}

function App() {
  const [show, setShow] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [groupedTabs, setGroupedTabs] = useState({});
  const [groupField] = useState('windowId');
  const [position, setPosition] = useState('topLeft');

  useEffect(() => {
    browser.runtime.sendMessage({ command: 'get_position' }).then(response => {
      console.log(`position: ${response.position}`)
      setPosition(response.position);
    });
  }, []);

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
      setGroupedTabs(ts);
    }
  }, [tabs, groupField]);

  useEffect(() => {
    if (show) {
      browser.runtime.sendMessage({ command: 'get_tabs' }).then(response => {
        setTabs(response.tabs);
      });
    }
  }, [show]);

  const handleMouseOver = () => {
    setShow(true);
  };

  const handleMouseOut = () => {
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
    if (shouldShowTabs(position, e.clientX, e.clientY)) {
      setShow(true);
    }
  });

  return (
    <Collapse in={show}>
      <Box
        backgroundColor="#FFFFFF"
        position="fixed"
        top="0"
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
                  <Box w="26ch">
                    <ScaleButton
                      textAlign="left"
                      maxW="25ch"
                      p={2}
                      size="xs"
                      variant="outline"
                      bg="gray.50"
                      colorScheme="blue"
                      onClick={() => switchTab(tab.id, tab.windowId)}
                      fontSize="small">
                      <Image scale={1} height="1em" marginRight={1} src={tab.favIconUrl}></Image>
                      <Box as="span" display="block" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                        {tab.title}
                      </Box>
                    </ScaleButton>
                  </Box>
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
