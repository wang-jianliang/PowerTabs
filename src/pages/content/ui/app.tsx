import React, { useState, useEffect } from 'react';
import { Box, Image, Slide, StackDivider, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { browser } from 'webextension-polyfill-ts';
import ScaleButton from './ScaleButton';
import useStorage from '@src/shared/hooks/useStorage';
import settingsStorage from '@src/shared/storages/settingsStorage';

// function shouldShowTabs(position, x, y) {
//   console.log(`shouldShowTabs: ${position}, ${x}, ${y}`);
//   if (position === 'topLeft') {
//     return y <= 5 && x <= 200;
//   } else if (position === 'topRight') {
//     return y <= 5 && x >= window.innerWidth - 200;
//   } else if (position === 'bottomLeft') {
//     return y >= window.innerHeight - 5 && x <= 200;
//   } else if (position === 'bottomRight') {
//     return y >= window.innerHeight - 5 && x >= window.innerWidth - 200;
//   } else if (position === 'top') {
//     return y <= 5;
//   } else if (position === 'bottom') {
//     return y >= window.innerHeight - 5;
//   } else if (position === 'left') {
//     return x <= 5;
//   } else if (position === 'right') {
//     return x >= window.innerWidth - 5;
//   }
//   return false;
// }

const siderStyles = {
  right: {
    right: '-4px',
    height: '50vh',
    width: '8px',
    top: '25vh',
  },
  left: {
    left: '-4px',
    height: '50vh',
    width: '8px',
    top: '25vh',
  },
};

function App() {
  const [show, setShow] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [groupedTabs, setGroupedTabs] = useState({});
  const [groupField] = useState('windowId');
  const [position, setPosition] = useState(null);
  const [style, setStyle] = useState({} as React.CSSProperties);
  const settings = useStorage(settingsStorage);

  useEffect(() => {
    // browser.runtime.sendMessage({ command: 'get_position' }).then(response => {
    //   console.log(`position: ${response.position}`)
    //   setPosition(response.position);
    // });
    if (!settings) {
      return;
    }
    setPosition(settings.position);
    switch (settings.position) {
      case 'top':
      case 'topLeft':
      case 'topRight':
        setStyle({ top: 0, width: '100vw', maxHeight: '50vh' });
        break;
      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        setStyle({ bottom: 0, width: '100vw', maxHeight: '50vh' });
        break;
      case 'left':
        setStyle({ left: 0, height: '100vh', maxWidth: '50vw' });
        break;
      case 'right':
        setStyle({ right: 0, top: 0, height: '100vh', maxWidth: '50vw' });
        break;
    }
  }, [settings]);

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

  // document.addEventListener('mouseleave', function (e) {
  //   if (!position) {
  //     return;
  //   }
  //   console.log('mouseleave', e.clientX, e.clientY);
  //   if (shouldShowTabs(position, e.clientX, e.clientY)) {
  //     console.log('show tabs');
  //     setShow(true);
  //   }
  // });

  return (
    <Box>
      <Box
        onMouseOver={handleMouseOver}
        position="fixed"
        zIndex="10000"
        backgroundColor="red"
        borderRadius="4px"
        cursor="ew-resize"
        style={siderStyles[position]}></Box>
      <Slide in={show}>
        <Box
          backgroundColor="#FFFFFF"
          position="fixed"
          zIndex="10000"
          style={style}
          overflowY="auto"
          padding={3}
          rounded="md"
          shadow="md"
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
      </Slide>
    </Box>
  );
}

export default App;
