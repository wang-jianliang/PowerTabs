import { Box, ButtonProps } from '@chakra-ui/react';
import { useState } from 'react';

interface ScaleButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

function ScaleBox({ children, ...props }: ScaleButtonProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      maxWidth={props.maxWidth || '100%'}
      transition="all 0.2s ease"
      transform={isHover ? 'scale(1.2)' : 'scale(1)'}
      zIndex={isHover ? '1' : '0'}
      position={isHover ? 'relative' : 'static'}
      {...props}>
      {children}
    </Box>
  );
}

export default ScaleBox;
