import React, { useEffect } from 'react';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { Divider, Flex, Image, Radio, RadioGroup, Text, Wrap, WrapItem } from '@chakra-ui/react';
import useStorage from '@src/shared/hooks/useStorage';
import settingsStorage from '@src/shared/storages/settingsStorage';
import { Position } from '@src/types';

const positions = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'top', 'bottom', 'left', 'right'] as const;

const Popup = () => {
  const [position, setPosition] = React.useState('topLeft');
  const settings = useStorage(settingsStorage);

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
    settingsStorage.setPosition(position);
    // browser.runtime.sendMessage({ command: 'save_position', position: position }).then(() => {});
  };
  return (
    <Flex className="App" direction="column" padding={8}>
      <Flex justifyContent="center">
        <Image src="../../../icon-small.png" alt="Power Tabs" borderRadius="full" boxSize="150px" />
      </Flex>
      <Divider marginBottom={2} />
      <Text fontSize="xl" fontWeight="bold" textAlign="left">
        Choose the position of the tabs
      </Text>
      <RadioGroup
        marginTop={4}
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
    </Flex>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
