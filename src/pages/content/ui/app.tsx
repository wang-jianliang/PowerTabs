import React, { useState, useEffect } from 'react';
import { Box, Slide, StackDivider, Switch, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { browser } from 'webextension-polyfill-ts';
import ScaleBox from './ScaleBox';
import useStorage from '@src/shared/hooks/useStorage';
import settingsStorage from '@src/shared/storages/settingsStorage';
import { TabButton } from '@pages/content/component/TabButton';

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

type Layout = 'vertical' | 'horizontal';
type TabsPosition = 'left' | 'right' | 'top' | 'bottom';
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
  top: {
    top: '-4px',
    width: '50vw',
    height: '8px',
    left: '25vw',
  },
  topRight: {
    top: '-4px',
    width: '30vw',
    height: '8px',
    left: '70vw',
  },
  topLeft: {
    top: '-4px',
    width: '30vw',
    height: '8px',
    left: 0,
  },
  bottom: {
    bottom: '-4px',
    width: '50vw',
    height: '8px',
    left: '25vw',
  },
  bottomRight: {
    bottom: '-4px',
    width: '30vw',
    height: '8px',
    left: '71vw',
  },
  bottomLeft: {
    bottom: '-4px',
    width: '30vw',
    height: '8px',
    left: '-1vw',
  },
};
const tabsStyles = {
  right: {
    right: 0,
    top: 0,
  },
  left: {
    left: 0,
    top: 0,
  },
  top: {
    top: 0,
    left: 0,
  },
  bottom: {
    bottom: 0,
    left: 0,
  },
};

function scaleBody(shrink: boolean, position: string) {
  const body = document.querySelector('body');
  if (body) {
    if (!shrink) {
      switch (position) {
        case 'top':
        case 'bottom':
          body.style.transition = 'height 0.3s ease-in-out, transform 0.3s ease-in-out';
          body.style.height = '100vh';
          body.style.transform = 'translateY(0)';
          return;
        case 'left':
        case 'right':
          body.style.transition = 'width 0.3s ease-in-out, transform 0.3s ease-in-out';
          body.style.width = '100vw';
          body.style.transform = 'translateX(0)';
          return;
      }
      return;
    }
    switch (position) {
      case 'top':
        body.style.transition = 'height 0.3s ease-in-out, transform 0.3s ease-in-out';
        body.style.height = 'calc(100vh - 38vh)';
        body.style.transform = 'translateY(38vh)';
        return;
      case 'bottom':
        return;
      case 'right':
        body.style.transition = 'width 0.3s ease-in-out, transform 0.3s ease-in-out';
        body.style.width = 'calc(100vw - 40ch)';
        body.style.transform = '-40ch';
        return;
      case 'left':
        body.style.transition = 'width 0.3s ease-in-out, transform 0.3s ease-in-out';
        body.style.width = 'calc(100vw - 40ch)';
        body.style.transform = 'translateX(40ch)';
        return;
    }
  }
}

function App() {
  const [show, setShow] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [groupedTabs, setGroupedTabs] = useState({});
  const [groupField] = useState('windowId');
  const [position, setPosition] = useState(null);
  const [tabsPosition, setTabsPosition] = useState(null as TabsPosition | null);
  const [layout, setLayout] = useState('vertical' as Layout);
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
        setTabsPosition('top');
        setLayout('horizontal');
        break;
      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        setTabsPosition('bottom');
        setLayout('horizontal');
        break;
      case 'left':
        setTabsPosition('left');
        setLayout('vertical');
        break;
      case 'right':
        setTabsPosition('right');
        setLayout('vertical');
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

  const handleMouseEnter = () => {
    scaleBody(true, tabsPosition);
    setShow(true);
  };

  const handleMouseLeave = () => {
    scaleBody(false, tabsPosition);
    setShow(false);
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
  console.log('tabsPosition', tabsPosition);
  console.log('position', position);

  return (
    tabsPosition &&
    layout && (
      <Box>
        <Slide in={!show} direction={tabsPosition} style={{ width: 'max-content' }}>
          <Box
            onMouseEnter={handleMouseEnter}
            position="fixed"
            zIndex="10000"
            backgroundColor="blue.500"
            borderRadius="4px"
            cursor="ew-resize"
            style={siderStyles[position]}></Box>
        </Slide>
        <Slide in={show} direction={tabsPosition} style={{ width: 'max-content' }}>
          <Box
            id="tabs-container"
            backgroundColor="#FFFFFF"
            right={0}
            zIndex="10000"
            width={layout === 'vertical' ? 'min-content' : '100vw'}
            height={layout === 'horizontal' ? '38vh' : '100vh'}
            bgColor="gray.50"
            overflowY="auto"
            padding={3}
            rounded="md"
            shadow="md"
            style={tabsStyles[tabsPosition]}
            onMouseLeave={handleMouseLeave}>
            <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
              <Box w="100%" display="flex">
                <Switch />
              </Box>
              {Object.keys(groupedTabs).map((key, keyIndex) => (
                <Wrap height="100%" key={keyIndex}>
                  {groupedTabs[key].map((tab, index) => (
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
              ))}
            </VStack>
          </Box>
        </Slide>
      </Box>
    )
  );
}

export default App;
