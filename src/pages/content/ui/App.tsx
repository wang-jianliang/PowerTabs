import React, { useState, useEffect } from 'react';
import {
  Box,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Slide,
  StackDivider,
  Switch,
  VStack,
} from '@chakra-ui/react';
import { browser } from 'webextension-polyfill-ts';
import { useStorage } from '@plasmohq/storage/hook';
import { DEFAULT_SETTINGS, STORAGE_KEY_GROUP_FIELD, STORAGE_KEY_SETTINGS } from '@root/utils/reload/constant';
import { convertVwVhToPixels } from '@src/utils';
import TabsGroup from '@pages/content/component/TabsGroup';
import { SearchIcon } from '@chakra-ui/icons';

function shouldShowTabs(position, x, y) {
  if (position === 'topLeft') {
    return y <= 5 && x <= convertVwVhToPixels(siderStyles[position].width);
  } else if (position === 'topRight') {
    return y <= 5 && x >= window.innerWidth - convertVwVhToPixels(siderStyles[position].width);
  } else if (position === 'bottomLeft') {
    return y >= window.innerHeight - 5 && x <= convertVwVhToPixels(siderStyles[position].width);
  } else if (position === 'bottomRight') {
    return y >= window.innerHeight - 5 && x >= window.innerWidth - convertVwVhToPixels(siderStyles[position].width);
  } else if (position === 'top') {
    return (
      y <= 5 &&
      x >= convertVwVhToPixels(siderStyles[position].left) &&
      x <= convertVwVhToPixels(siderStyles[position].left) + convertVwVhToPixels(siderStyles[position].width)
    );
  } else if (position === 'bottom') {
    return (
      y >= window.innerHeight - 5 &&
      x >= convertVwVhToPixels(siderStyles[position].left) &&
      x <= convertVwVhToPixels(siderStyles[position].left) + convertVwVhToPixels(siderStyles[position].width)
    );
  } else if (position === 'left') {
    return (
      x <= 5 &&
      y >= convertVwVhToPixels(siderStyles[position].top) &&
      y <= convertVwVhToPixels(siderStyles[position].top) + convertVwVhToPixels(siderStyles[position].height)
    );
  } else if (position === 'right') {
    return (
      x >= window.innerWidth - 5 &&
      y >= convertVwVhToPixels(siderStyles[position].top) &&
      y <= convertVwVhToPixels(siderStyles[position].top) + convertVwVhToPixels(siderStyles[position].height)
    );
  }
  return false;
}

const verticalTabsWidth = '380px';

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
        body.style.width = `calc(100vw - ${verticalTabsWidth})`;
        body.style.transform = `-${verticalTabsWidth}`;
        return;
      case 'left':
        body.style.transition = 'width 0.3s ease-in-out, transform 0.3s ease-in-out';
        body.style.width = `calc(100vw - ${verticalTabsWidth})`;
        body.style.transform = `translateX(${verticalTabsWidth})`;
        return;
    }
  }
}

function App() {
  const [show, setShow] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [groupedTabs, setGroupedTabs] = useState({});
  const [groupField, setGroupField] = useStorage(STORAGE_KEY_GROUP_FIELD, 'windowId');
  const [position, setPosition] = useState(null);
  const [tabsPosition, setTabsPosition] = useState(null as TabsPosition | null);
  const [layout, setLayout] = useState('vertical' as Layout);
  const [settings, setSettings] = useStorage(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);

  useEffect(() => {
    if (!settings) {
      return;
    }
    setPosition(settings.position);
    let tp: TabsPosition = 'right';
    switch (settings.position) {
      case 'top':
      case 'topLeft':
      case 'topRight':
        tp = 'top';
        setLayout('horizontal');
        break;
      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        tp = 'bottom';
        setLayout('horizontal');
        break;
      case 'left':
        tp = 'left';
        setLayout('vertical');
        break;
      case 'right':
        tp = 'right';
        setLayout('vertical');
        break;
    }
    setTabsPosition(tp);

    if (settings.pinned) {
      setShow(true);
      scaleBody(true, tp);
    } else {
      scaleBody(false, tp);
    }
  }, [settings]);

  const groupTabs = (tabs, field: string) => {
    return tabs.reduce((acc, obj: object) => {
      let key = obj[field] != null ? String(obj[field]) : '__undefined__';
      if (field === 'url') {
        key = new URL(key).hostname;
      }
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
      console.log(ts);
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
    // scaleBody(true, tabsPosition);
    // setShow(true);
  };

  const handleMouseLeave = () => {
    // scaleBody(false, tabsPosition);
    if (settings.pinned) {
      return;
    }
    setShow(false);
  };

  function showOnMouseEvent(e) {
    if (shouldShowTabs(position, e.clientX, e.clientY)) {
      setShow(true);
    }
  }

  useEffect(() => {
    if (!position) {
      return;
    }
    document.addEventListener('mousemove', showOnMouseEvent);
    return () => {
      document.removeEventListener('mousemove', showOnMouseEvent);
    };
  }, [position]);

  const showRef = React.useRef(show);
  React.useEffect(() => {
    showRef.current = show;
  }, [show]);

  // listen for tab close and open events from background script, then update the tabs state
  useEffect(() => {
    const handleTabsUpdate = async request => {
      console.log('tabs update', request);
      if (request.command === 'tab_closed' || request.command === 'tab_created') {
        console.log('updating tabs', showRef.current);
        if (showRef.current) {
          browser.runtime.sendMessage({ command: 'get_tabs' }).then(response => {
            setTabs(response.tabs);
          });
        }
      }
    };
    browser.runtime.onMessage.addListener(handleTabsUpdate);
    return () => {
      browser.runtime.onMessage.removeListener(handleTabsUpdate);
    };
  }, []);

  // when current tab is re-active, get all tabs
  useEffect(() => {
    const handleTabActivated = async activeInfo => {
      if (!showRef.current) {
        return;
      }
      console.log('tab activated', activeInfo);
      browser.runtime.sendMessage({ command: 'get_tabs' }).then(response => {
        setTabs(response.tabs);
      });
    };
    document.addEventListener('visibilitychange', handleTabActivated);
    return () => {
      document.removeEventListener('visibilitychange', handleTabActivated);
    };
  }, []);

  return (
    tabsPosition &&
    layout && (
      <Box>
        <Slide in={!show} direction={tabsPosition} style={{ width: 'max-content' }}>
          <Box
            onMouseEnter={handleMouseEnter}
            position="fixed"
            zIndex="10000"
            backgroundColor={`${settings.colorScheme}.500`}
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
            width={layout === 'vertical' ? verticalTabsWidth : '100vw'}
            height={layout === 'horizontal' ? '38vh' : '100vh'}
            overflowY="auto"
            padding={3}
            rounded="md"
            shadow="md"
            style={tabsStyles[tabsPosition]}
            onMouseLeave={handleMouseLeave}>
            <VStack divider={<StackDivider borderColor="gray.200" />} spacing="16px" align="stretch">
              <Box width="100%" display="inline-flex" justifyContent="space-between" paddingX={4} alignItems="center">
                <Box display="inline-flex" alignItems="center">
                  <Box fontSize="var(--chakra-fontSizes-sm)" marginRight={2}>
                    Group By:
                  </Box>
                  <RadioGroup onChange={setGroupField} value={groupField} display="inline-flex" alignItems="center">
                    <Radio
                      key="windowId"
                      value="windowId"
                      colorScheme={settings.colorScheme}
                      color={settings.colorScheme}
                      size="sm">
                      Window
                    </Radio>
                    <Radio
                      key="url"
                      value="url"
                      colorScheme={settings.colorScheme}
                      color={settings.colorScheme}
                      marginLeft={2}
                      size="sm">
                      Domain
                    </Radio>
                  </RadioGroup>
                </Box>
                <Divider height={5} orientation="vertical" borderColor="gray.200" />
                <Box display="inline-flex" alignItems="center">
                  <Box fontSize="var(--chakra-fontSizes-sm)" marginRight={2}>
                    Pin:
                  </Box>
                  <Switch
                    size="sm"
                    colorScheme={settings.colorScheme}
                    isChecked={settings.pinned}
                    onChange={event => {
                      setSettings(prev => ({ ...prev, pinned: event.target.checked }));
                    }}
                  />
                </Box>
              </Box>
              <InputGroup
                onChange={e => {
                  const filter = (e.target as HTMLInputElement).value;
                  if (filter.length > 0) {
                    const filteredTabs = tabs.filter(
                      tab =>
                        tab.title.toLowerCase().includes(filter.toLowerCase()) ||
                        tab.url.toLowerCase().includes(filter.toLowerCase()),
                    );
                    setGroupedTabs(groupTabs(filteredTabs, groupField));
                  } else {
                    setGroupedTabs(groupTabs(tabs, groupField));
                  }
                }}>
                <InputLeftElement pointerEvents="none" height="100%">
                  <SearchIcon color={settings.colorScheme} />
                </InputLeftElement>
                <Input
                  height="32px"
                  variant="outline"
                  colorScheme={settings.colorScheme}
                  borderColor="gray.200"
                  borderRadius={18}
                  placeholder="Filter"
                  size="sm"
                />
              </InputGroup>

              {Object.keys(groupedTabs).map((key, i) => (
                <TabsGroup
                  iconUrl={groupField === 'windowId' ? undefined : groupedTabs[key][0].favIconUrl}
                  name={groupField === 'windowId' ? `Window ${i}` : key}
                  key={key}
                  groupKey={key}
                  tabs={groupedTabs[key]}
                  layout={layout}
                />
              ))}
            </VStack>
          </Box>
        </Slide>
      </Box>
    )
  );
}

export default App;
