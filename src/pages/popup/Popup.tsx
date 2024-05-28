import React, { useEffect } from 'react';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { Box, Divider, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import useStorage from '@src/shared/hooks/useStorage';
import settingsStorage from '@src/shared/storages/settingsStorage';
import { Position } from '@src/types';

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
    <Box className="App">
      <img className="icon" src="../../../icon-full.png" alt="Power Tabs" />
      <Divider />
      <RadioGroup
        onChange={pos => {
          setPosition(pos);
          savePosition(pos as Position);
        }}
        value={position}>
        <Stack direction="column">
          <Radio value="topLeft">Top Left</Radio>
          <Radio value="topRight">Top Right</Radio>
          <Radio value="bottomLeft">Bottom Left</Radio>
          <Radio value="bottomRight">Bottom Right</Radio>
          <Radio value="top">Top</Radio>
          <Radio value="bottom">Bottom</Radio>
          <Radio value="left">Left</Radio>
          <Radio value="right">Right</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
