import React, { useEffect } from 'react';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { Divider, Flex, Image, Radio, RadioGroup, Switch, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useStorage } from '@plasmohq/storage/hook';
import { Position } from '@src/types';
import { DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS } from '@root/utils/reload/constant';

const positions = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'top', 'bottom', 'left', 'right'] as const;

const Popup = () => {
  const [position, setPosition] = React.useState('topLeft');
  const [settings, setSettings] = useStorage(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);

  useEffect(() => {
    if (!settings) {
      return;
    }
    setPosition(settings.position);
    // browser.runtime.sendMessage({ command: 'get_position' }).then(response => {
    //   setPosition(response.position);
    // });
  }, [settings]);
  const savePosition = (position: Position) => {
    setSettings({ ...settings, position });
    // browser.runtime.sendMessage({ command: 'save_position', position: position }).then(() => {});
  };
  return (
    <Flex className="App" direction="column" padding={8} gap={4}>
      <Flex justifyContent="center">
        <Image src="../../../icon-small.png" alt="Power Tabs" borderRadius="full" boxSize="150px" />
      </Flex>
      <Divider />
      <Text fontSize="18px" fontWeight="bold" textAlign="left">
        Position of the trigger area
      </Text>
      <RadioGroup
        onChange={pos => {
          setPosition(pos);
          savePosition(pos as Position);
        }}
        value={position}>
        <Wrap spacing={3}>
          {positions.map(pos => (
            <WrapItem key={pos} width={40}>
              <Radio key={pos} value={pos}>
                {pos}
              </Radio>
            </WrapItem>
          ))}
        </Wrap>
      </RadioGroup>
      <Divider />
      <Text fontSize="18px" fontWeight="bold" textAlign="left">
        Tabs panel settings
      </Text>
      <Switch
        style={{ alignSelf: 'flex-start' }}
        isChecked={settings.pinned}
        onChange={event => setSettings(prev => ({ ...prev, pinned: event.target.checked }))}>
        Pin the tabs
      </Switch>
    </Flex>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
