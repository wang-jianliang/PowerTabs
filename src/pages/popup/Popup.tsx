import React, { useEffect } from 'react';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { Box, Divider, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { browser } from 'webextension-polyfill-ts';

const Popup = () => {
  const [position, setPosition] = React.useState("topLeft");

  useEffect(() => {
    browser.runtime.sendMessage({ command: 'get_position' }).then(response => {
      setPosition(response.position);
    });
  });
  const savePosition = (position: string) => {
    browser.runtime.sendMessage({ command: 'save_position', position: position }).then(() => {});
  }
  return (
    <Box className="App">
      <img className="icon" src="../../../icon-full.png" alt="Power Tabs" />
      <Divider/>
      <RadioGroup onChange={(pos) => {
        setPosition(pos);
        savePosition(pos);
      }} value={position}>
        <Stack direction='row'>
          <Radio value='topLeft'>Top Left</Radio>
          <Radio value='topRight'>Top Right</Radio>
          <Radio value='bottomLeft'>Bottom Left</Radio>
          <Radio value='bottomRight'>Bottom Right</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
